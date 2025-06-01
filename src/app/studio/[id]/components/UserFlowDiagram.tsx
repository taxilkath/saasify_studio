import React, { useCallback } from 'react';
import ReactFlow, {
  Background, Controls, Handle, Position, addEdge,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

// Types
export type CustomNodeData = {
  title: string;
  description: string;
  checklist: { label: string; status: string }[];
};

// Custom Node Component
const CustomNode = ({ data }: { data: CustomNodeData }) => (
  <div className="bg-zinc-900 text-white rounded-lg p-4 shadow-lg w-72">
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

const initialNodes = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 0, y: 0 },
    data: {
      title: 'Customer Touchpoints',
      description: 'Entry points where customers interact with support.',
      checklist: [
        { label: 'Deploy Chat Widget', status: 'done' },
        { label: 'Connect Email & Social APIs', status: 'in-progress' },
        { label: 'Webhook Integrations', status: 'pending' },
      ],
    },
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 350, y: 0 },
    data: {
      title: 'API Gateway',
      description: 'Routes incoming tickets to backend services.',
      checklist: [
        { label: 'Set up POST /ticket', status: 'done' },
        { label: 'Implement Auth', status: 'in-progress' },
        { label: 'Forward to AI Service', status: 'pending' },
      ],
    },
  },
  {
    id: '3',
    type: 'customNode',
    position: { x: 700, y: -100 },
    data: {
      title: 'AI Service',
      description: 'Handles NLP, sentiment, and ticket categorization.',
      checklist: [
        { label: 'Sentiment Analysis', status: 'done' },
        { label: 'Auto Categorization', status: 'in-progress' },
        { label: 'Escalation Logic', status: 'pending' },
      ],
    },
  },
  {
    id: '4',
    type: 'customNode',
    position: { x: 700, y: 150 },
    data: {
      title: 'Backend Service',
      description: 'Ticket storage, logs, and escalation routing.',
      checklist: [
        { label: 'Save to DB', status: 'done' },
        { label: 'Real-time Events', status: 'pending' },
        { label: 'Queue Escalations', status: 'in-progress' },
      ],
    },
  },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
];

function UserFlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

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
        <Background color="#333" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default UserFlowDiagram; 