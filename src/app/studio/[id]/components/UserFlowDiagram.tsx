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
    "id": "1",
    "type": "customNode",
    "position": { "x": 0, "y": 0 },
    "data": {
      "title": "Platform Entry",
      "description": "Users discover and join UDG Central platform",
      "checklist": [
        { "label": "Brand Registration", "status": "done" },
        { "label": "Creator Registration", "status": "done" },
        { "label": "Profile Setup", "status": "in-progress" }
      ]
    }
  },
  {
    "id": "2",
    "type": "customNode",
    "position": { "x": 350, "y": -100 },
    "data": {
      "title": "Brand Dashboard",
      "description": "Brand control center for contest management",
      "checklist": [
        { "label": "Contest Creation Tools", "status": "done" },
        { "label": "Analytics Dashboard", "status": "in-progress" },
        { "label": "Creator Discovery", "status": "pending" }
      ]
    }
  },
  {
    "id": "3",
    "type": "customNode",
    "position": { "x": 350, "y": 100 },
    "data": {
      "title": "Creator Dashboard",
      "description": "Creator workspace for contest participation",
      "checklist": [
        { "label": "Contest Browser", "status": "done" },
        { "label": "Portfolio Management", "status": "in-progress" },
        { "label": "Submission Tools", "status": "pending" }
      ]
    }
  },
  {
    "id": "4",
    "type": "customNode",
    "position": { "x": 700, "y": -100 },
    "data": {
      "title": "Contest Creation",
      "description": "Brands set up contests with requirements and prizes",
      "checklist": [
        { "label": "Contest Details Form", "status": "done" },
        { "label": "Prize Configuration", "status": "in-progress" },
        { "label": "Publishing System", "status": "pending" }
      ]
    }
  },
  {
    "id": "5",
    "type": "customNode",
    "position": { "x": 700, "y": 100 },
    "data": {
      "title": "Contest Discovery",
      "description": "Creators find and filter relevant contests",
      "checklist": [
        { "label": "Search & Filters", "status": "done" },
        { "label": "Matching Algorithm", "status": "in-progress" },
        { "label": "Contest Recommendations", "status": "pending" }
      ]
    }
  },
  {
    "id": "6",
    "type": "customNode",
    "position": { "x": 1050, "y": 0 },
    "data": {
      "title": "Active Contest Hub",
      "description": "Central processing for live contests",
      "checklist": [
        { "label": "Submission Collection", "status": "done" },
        { "label": "Content Moderation", "status": "in-progress" },
        { "label": "Real-time Updates", "status": "pending" }
      ]
    }
  },
  {
    "id": "7",
    "type": "customNode",
    "position": { "x": 1400, "y": -100 },
    "data": {
      "title": "Judging System",
      "description": "Brand review and winner selection process",
      "checklist": [
        { "label": "Review Interface", "status": "done" },
        { "label": "Scoring System", "status": "in-progress" },
        { "label": "Winner Selection", "status": "pending" }
      ]
    }
  },
  {
    "id": "8",
    "type": "customNode",
    "position": { "x": 1400, "y": 100 },
    "data": {
      "title": "Rewards & Recognition",
      "description": "Prize distribution and creator recognition",
      "checklist": [
        { "label": "Payment Processing", "status": "done" },
        { "label": "Winner Announcements", "status": "in-progress" },
        { "label": "Portfolio Updates", "status": "pending" }
      ]
    }
  },
  {
    "id": "9",
    "type": "customNode",
    "position": { "x": 1750, "y": 0 },
    "data": {
      "title": "Analytics & Insights",
      "description": "Performance tracking and platform optimization",
      "checklist": [
        { "label": "Contest Analytics", "status": "done" },
        { "label": "Creator Metrics", "status": "in-progress" },
        { "label": "ROI Tracking", "status": "pending" }
      ]
    }
  }
];
const initialEdges = [
  { "id": "e1-2", "source": "1", "target": "2", "animated": true },
  { "id": "e1-3", "source": "1", "target": "3", "animated": true },
  { "id": "e2-4", "source": "2", "target": "4", "animated": true },
  { "id": "e3-5", "source": "3", "target": "5", "animated": true },
  { "id": "e4-6", "source": "4", "target": "6", "animated": true },
  { "id": "e5-6", "source": "5", "target": "6", "animated": true },
  { "id": "e6-7", "source": "6", "target": "7", "animated": true },
  { "id": "e6-8", "source": "6", "target": "8", "animated": true },
  { "id": "e7-9", "source": "7", "target": "9", "animated": true },
  { "id": "e8-9", "source": "8", "target": "9", "animated": true }
]

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