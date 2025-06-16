'use client'

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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { CheckCircle, Circle, GitBranch, Loader2, PenSquare, Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { getLayoutedElements } from '@/utils/layout';
import debounce from 'lodash.debounce';

// Types
export type CustomNodeData = {
  title: string;
  description: string;
  checklist: { id: string; label: string; status: 'done' | 'in-progress' | 'pending' }[];
};

type CustomNodeProps = {
  data: CustomNodeData;
  id: string;
};

// Custom Node Component
const CustomNode = React.memo(({ data, id }: CustomNodeProps) => {
  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-lg border border-border w-80 group transition-all duration-300 transform hover:scale-105 hover:border-primary/80">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <GitBranch className="w-5 h-5 text-primary" />
          </div>
          <div className="font-bold text-lg">{data.title}</div>
        </div>
        <p className="text-muted-foreground text-sm mb-4 h-12 overflow-y-auto">{data.description}</p>
        <div className="space-y-2 text-sm">
          {data.checklist.map(item => (
            <div key={item.id} className="flex items-center gap-2">
              {item.status === 'done' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-muted-foreground/50" />}
              <span className={item.status === 'done' ? 'line-through text-muted-foreground' : ''}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!bg-primary/50 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-primary/50 !w-3 !h-3" />
    </div>
  );
});
CustomNode.displayName = 'CustomNode';

const nodeTypes = { customNode: CustomNode };

// Edit Dialog
function EditNodeDialog({
  node,
  isOpen,
  onClose,
  onUpdate,
}: {
  node: Node<CustomNodeData> | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: CustomNodeData) => void;
}) {
  const [data, setData] = useState<CustomNodeData | null>(null);

  useEffect(() => {
    if (node) {
      // Deep clone to prevent direct state mutation
      setData(JSON.parse(JSON.stringify(node.data)));
    }
  }, [node]);

  if (!isOpen || !node || !data) return null;

  const handleUpdate = () => {
    // Pass the dialog's current state back
    onUpdate(data);
    onClose();
  };

  const handleChecklistChange = (index: number, newLabel: string) => {
    const newChecklist = [...data.checklist];
    newChecklist[index].label = newLabel;
    setData({ ...data, checklist: newChecklist });
  };

  const handleChecklistStatusChange = (index: number) => {
    const newChecklist = [...data.checklist];
    const currentStatus = newChecklist[index].status;
    const statuses: Array<CustomNodeData['checklist'][0]['status']> = ['pending', 'in-progress', 'done'];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    newChecklist[index].status = statuses[nextIndex];
    setData({ ...data, checklist: newChecklist });
  };
  
  const addChecklistItem = () => {
    const newChecklist: CustomNodeData['checklist'] = [...data.checklist, { id: uuidv4(), label: 'New Item', status: 'pending' }];
    setData({ ...data, checklist: newChecklist });
  };
  
  const removeChecklistItem = (index: number) => {
    const newChecklist = data.checklist.filter((_, i) => i !== index);
    setData({ ...data, checklist: newChecklist });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card">
        <DialogHeader>
          <DialogTitle>Edit Node: {data.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} className="mt-2" rows={4} />
          </div>
          <div>
            <label className="text-sm font-medium">Checklist</label>
            <div className="space-y-2 mt-2">
              {data.checklist.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleChecklistStatusChange(index)}>
                    {item.status === 'done' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-muted-foreground/50" />}
                  </Button>
                  <Input value={item.label} onChange={(e) => handleChecklistChange(index, e.target.value)} />
                  <Button variant="ghost" size="icon" onClick={() => removeChecklistItem(index)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addChecklistItem} className="mt-2">Add Item</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Diagram Component
function UserFlowDiagram() {
  const params = useParams();
  const projectId = params?.id as string;
  const { theme } = useTheme();

  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingNode, setEditingNode] = useState<Node<CustomNodeData> | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const saveInProgress = useRef(false);
  
  // Debounced save function
  const debouncedSave = useMemo(
    () =>
      debounce(async (nodesToSave: Node<CustomNodeData>[], edgesToSave: Edge[]) => {
        if (saveInProgress.current) return;
        
        saveInProgress.current = true;
        setIsSaving(true);
        try {
          const res = await fetch(`/api/userflow/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nodes: nodesToSave, edges: edgesToSave }),
          });
          if (!res.ok) {
            throw new Error(`Failed to save changes: ${res.statusText}`);
          }
          setHasChanges(false);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsSaving(false);
          saveInProgress.current = false;
        }
      }, 1500),
    [projectId]
  );
  
  // Autosave effect
  useEffect(() => {
    // Don't save on initial load or if there are no changes
    if (loading || !hasChanges) {
      return;
    }
    
    // Do not save an empty diagram unless it was a result of a user action.
    // The `nodes` array will only be empty on a real deletion.
    const hasExistingNodes = nodes.length > 0;
    if (!hasExistingNodes && hasChanges) {
       // If the user deleted the last node, `nodes` will be empty and `hasChanges` will be true. We should save this.
    } else if (!hasExistingNodes) {
        // If there are no nodes and no pending changes, do nothing.
        return;
    }

    debouncedSave(nodes, edges);

    // Cleanup the debounced function on component unmount
    return () => {
      debouncedSave.cancel();
    };
  }, [nodes, edges, hasChanges, loading, debouncedSave]);

  // Fetch initial data
  useEffect(() => {
    async function fetchUserFlow() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/userflow/${projectId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed to fetch project');
        
        const diagram = json.data;
        let initialNodes = [];
        let initialEdges = [];

        // --- FIX: Only use UserFlow data as the source of truth ---
        if (diagram && diagram.nodes && diagram.nodes.length > 0) {
          initialNodes = diagram.nodes;
          initialEdges = diagram.edges || [];
        } else {
            // Handle case where there's no data yet.
            setNodes([]);
            setEdges([]);
            setLoading(false);
            return;
        }
        
        // Ensure all checklist items have a unique ID
        const nodesWithIds = initialNodes.map((node: Node<CustomNodeData>) => ({
            ...node,
            data: {
                ...node.data,
                checklist: node.data.checklist.map(item => {
                  const status = item.status || 'pending';
                  const validStatus = ['done', 'in-progress', 'pending'].includes(status) ? status : 'pending';
                  return {
                    ...item,
                    id: item.id || uuidv4(),
                    status: validStatus as 'done' | 'in-progress' | 'pending',
                  };
                })
            }
        }));

        const { layoutedNodes, layoutedEdges } = getLayoutedElements(nodesWithIds, initialEdges);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
        setHasChanges(false);
      }
    }
    if (projectId) fetchUserFlow();
  }, [projectId, setNodes, setEdges]);

  const onCustomNodesChange: OnNodesChange = useCallback((changes) => {
    setHasChanges(true);
    onNodesChange(changes);
  }, [onNodesChange]);

  const onCustomEdgesChange: OnEdgesChange = useCallback((changes) => {
    setHasChanges(true);
    onEdgesChange(changes);
  }, [onEdgesChange]);

  const onConnect = useCallback(
    (params: Connection) => {
      setHasChanges(true);
      setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds));
    },
    [setEdges]
  );
  
  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node<CustomNodeData>) => {
    // Deep clone to ensure we have a fresh copy for editing
    setEditingNode(JSON.parse(JSON.stringify(node)));
  }, []);

  const handleUpdateNode = (data: CustomNodeData) => {
    if (!editingNode) return;
    setHasChanges(true);
    setNodes((nds) =>
      nds.map((n) => (n.id === editingNode.id ? { ...n, data } : n))
    );
  };
  
  const handleAddNode = () => {
    const newNode: Node<CustomNodeData> = {
      id: uuidv4(),
      type: 'customNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        title: 'New Node',
        description: 'Double-click to edit this node.',
        checklist: [{ id: uuidv4(), label: 'New task', status: 'pending' }],
      },
    };
    setHasChanges(true);
    setNodes((nds) => [...nds, newNode]);
  };
  
  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    setHasChanges(true);
    // Important: React Flow calls this BEFORE actually removing the nodes from the state.
    // The `onNodesChange` handler will update the state.
  }, []);

  if (loading) return (
    <div className="rounded-xl border border-border bg-card p-8">
      <div className="flex items-center justify-center h-[70vh] bg-muted/20 rounded-lg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary"/>
          <div className="text-sm text-muted-foreground animate-pulse">Loading Interactive Diagram...</div>
        </div>
      </div>
    </div>
  );
  if (error) return <div className="text-destructive text-center p-8 rounded-xl border border-destructive/20 bg-destructive/10">Error: {error}</div>;

  return (
    <div className="w-full h-[70vh] rounded-xl border border-border bg-card relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onCustomNodesChange}
        onEdgesChange={onCustomEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{ animated: true, type: 'smoothstep' }}
        className="bg-card"
      >
        <Background
          variant={BackgroundVariant.Dots}
          color={theme === 'dark' ? '#333' : '#e4e4e7'}
          gap={20}
        />
        <Controls className="[&>button]:bg-card [&>button]:border-border [&>button:hover]:bg-muted" />
        <MiniMap className="!bg-card border-border" />
      </ReactFlow>

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Button onClick={handleAddNode} size="sm" variant="outline" className="bg-card/80 backdrop-blur-sm">
          <Plus className="w-4 h-4 mr-2"/>
          Add Node
        </Button>
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-card/80 border border-border backdrop-blur-sm">
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin"/>
            <span>Saving...</span>
          </>
        ) : hasChanges ? (
          <>
            <PenSquare className="w-4 h-4 text-yellow-500"/>
            <span className="text-yellow-500">Unsaved changes</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-green-500"/>
            <span>All changes saved</span>
          </>
        )}
      </div>

      <EditNodeDialog
        node={editingNode}
        isOpen={!!editingNode}
        onClose={() => setEditingNode(null)}
        onUpdate={handleUpdateNode}
      />
    </div>
  );
}

export default UserFlowDiagram; 