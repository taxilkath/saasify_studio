// src/components/UserFlowDialog.tsx

'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
  type NodeProps,
  type Edge,
  type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, Circle, CircleDot } from 'lucide-react';

// Define the type for our custom node data
export type CustomNodeData = {
  title: string;
  description: string;
  checklist: { label: string; status: 'done' | 'in-progress' | 'pending' }[];
};

// --- Custom Node Component ---
// This defines the appearance of each block in the diagram
const CustomNode = ({ data }: NodeProps<CustomNodeData>) => {
  const statusIcons = {
    done: <CheckCircle className="w-4 h-4 text-green-500" />,
    'in-progress': <CircleDot className="w-4 h-4 text-yellow-500 animate-pulse" />,
    pending: <Circle className="w-4 h-4 text-zinc-600" />,
  };

  return (
    <div className="bg-white/5 dark:bg-zinc-900/80 backdrop-blur-md text-white rounded-lg p-4 shadow-lg border border-white/10 w-72 hover:border-purple-500/50 transition-colors duration-300">
      <h3 className="text-base font-bold mb-1 text-purple-300">{data.title}</h3>
      <p className="text-xs text-zinc-400 mb-4">{data.description}</p>
      <ul className="space-y-2 text-sm">
        {data.checklist.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-zinc-300">
            {statusIcons[item.status]}
            <span className={item.status === 'done' ? 'line-through text-zinc-500' : ''}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
      <Handle type="target" position={Position.Left} className="!bg-purple-500 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-purple-500 !w-3 !h-3" />
    </div>
  );
};

const nodeTypes = { customNode: CustomNode };

// --- Main Dialog Component ---
interface UserFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialNodes: Node<CustomNodeData>[];
  initialEdges: Edge[];
}

export function UserFlowDialog({ open, onOpenChange, initialNodes, initialEdges }: UserFlowDialogProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
    [setEdges]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none sm:max-w-[95vw] sm:max-h-[90vh] bg-black/30 backdrop-blur-xl border-white/10 p-0 flex flex-col">
        <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Interactive User Flow</h2>
            <p className="text-sm text-zinc-400">Pan and zoom to explore the application architecture.</p>
        </div>
        <div className="flex-grow w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-transparent"
                // --- FIX: Renamed 'edgeOptions' to 'defaultEdgeOptions' ---
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: '#8b5cf6', strokeWidth: 2 },
                }}
            >
                <Background color="#444" gap={16} />
                <Controls />
            </ReactFlow>
        </div>
      </DialogContent>
    </Dialog>
  );
}