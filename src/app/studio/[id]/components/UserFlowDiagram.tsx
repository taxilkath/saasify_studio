import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background, Controls, Handle, Position, addEdge,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams } from 'next/navigation';
import { useTheme } from 'next-themes';

// Types
export type CustomNodeData = {
  title: string;
  description: string;
  checklist: { label: string; status: string }[];
};

// Custom Node Component
const CustomNode = ({ data }: { data: CustomNodeData }) => (
  <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-lg p-4 shadow-md border border-zinc-200 dark:border-zinc-700 w-72">
    <div className="text-lg font-semibold mb-2">{data.title}</div>
    <div className="text-sm text-zinc-400 mb-3">{data.description}</div>
    <ul className="space-y-1 text-sm">
      {data.checklist.map((item, i) => (
        <li key={i} className="flex items-center space-x-2">
          <span
            className={`h-2 w-2 rounded-full ${item.status === 'done'
              ? 'bg-green-400'
              : item.status === 'in-progress'
                ? 'bg-yellow-400'
                : 'bg-gray-500'
              }`}
          />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
    <Handle type="target" position={Position.Left} className="!bg-purple-500" />
    <Handle type="source" position={Position.Right} className="!bg-purple-500" />
  </div>
);

const nodeTypes = { customNode: CustomNode };

function UserFlowDiagram() {
  const params = useParams();
  const projectId = params?.id;
  const { theme } = useTheme();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  useEffect(() => {
    async function fetchBlueprint() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed to fetch project');
        const blueprint = json.data?.blueprint;
        const diagram = blueprint?.content?.user_flow_diagram;
        setNodes(diagram?.initialNodes || []);
        setEdges(diagram?.initialEdges || []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setNodes([]);
        setEdges([]);
      } finally {
        setLoading(false);
      }
    }
    if (projectId) fetchBlueprint();
  }, [projectId, setNodes, setEdges]);

  if (loading) return <div>Loading user flow...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div style={{ width: '100%', height: '60vh', minWidth: 0 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{ animated: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Background color={theme === 'dark' ? '#333' : '#e4e4e7'} gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default UserFlowDiagram; 