'use client'

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { produce } from 'immer';
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ReactFlowInstance,
  MiniMap,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { CheckCircle, Circle, GitBranch, Loader2, PenSquare, Plus, Save, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getLayoutedElements } from '@/utils/layout';
import debounce from 'lodash.debounce';

// Types
export type CustomNodeData = {
  title: string;
  description: string;
  checklist: { id: string; label: string; status: 'done' | 'in-progress' | 'pending' }[];
};

// Types for component props
type UserFlowDiagramProps = {
  project: { id: string };
  initialNodes: Node<CustomNodeData>[];
  initialEdges: Edge[];
};

const UserFlowDiagram = ({ project, initialNodes, initialEdges }: UserFlowDiagramProps) => {
  const { id: projectId } = project;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editNode, setEditNode] = useState(null);

  const onConnect = useCallback((params : Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const debouncedSave = useCallback(
    debounce(async (nodesToSave, edgesToSave) => {
      if (!projectId) return;
      try {
        const response = await fetch(`/api/userflow/${projectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nodes: nodesToSave, edges: edgesToSave }),
        });
        const result = await response.json();

        if (result.success) {
          setNodes(nodesToSave);
          setEdges(edgesToSave);
        } else {
          setError("Failed to save user flow data.");
          toast.error("Failed to save user flow data.");
        }
      } catch (err) {
        setError("Failed to save user flow data.");
        toast.error("Failed to save user flow data.");
        console.error(err);
      }
    }, 1500),
    [projectId, setNodes, setEdges]
  );

  const onCustomNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    debouncedSave(nodes, edges);
  }, [setNodes, debouncedSave, nodes, edges]);

  const onCustomEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
    debouncedSave(nodes, edges);
  }, [setEdges, debouncedSave, nodes, edges]);

  useEffect(() => {
    const fetchUserFlow = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/userflow/${projectId}`);
        const result = await response.json();

        if (result.success && result.data) {
          const { nodes: fetchedNodes, edges: fetchedEdges } = result.data;
          if (Array.isArray(fetchedNodes) && fetchedNodes.length > 0) {
            setNodes(fetchedNodes);
            setEdges(fetchedEdges || []);
          } else {
            // Fallback to initial props if no data is in the userFlow table yet
            setNodes(initialNodes || []);
            setEdges(initialEdges || []);
          }
        } else {
            // Even if the fetch 'fails' (e.g. 404), we can still start with the blueprint data
            setNodes(initialNodes || []);
            setEdges(initialEdges || []);
            if(result.error) {
                console.warn("Could not fetch user flow:", result.error);
            }
        }
      } catch (err) {
        setError("Failed to load user flow data.");
        toast.error("Failed to load user flow data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchUserFlow();
    }
  }, [projectId, setNodes, setEdges, initialNodes, initialEdges]);

  return (
    <div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onCustomNodesChange}
        onEdgesChange={onCustomEdgesChange}
        onConnect={onConnect}
      >
        {/* Render your diagram component here */}
      </ReactFlow>
    </div>
  );
};

export default UserFlowDiagram; 