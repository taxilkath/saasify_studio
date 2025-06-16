import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { produce } from 'immer';
import {
  Dialog,
  useNodesState,
  useEdgesState,
  addEdge,
  useCallback,
  useEffect,
  useState,
  useDebounce,
  debounce
} from '@react-flow-renderer/core';

const UserFlowDiagram = ({ project, initialNodes, initialEdges }) => {
  const { id: projectId } = project;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editNode, setEditNode] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

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
    }, [projectId, setNodes, setEdges]),
    [projectId, setNodes, setEdges]
  );

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

  // Autosave changes
  useEffect(() => {
    const handleChange = () => {
      debouncedSave(nodes, edges);
    };

    onNodesChange(handleChange);
    onEdgesChange(handleChange);

    return () => {
      onNodesChange.cancel();
      onEdgesChange.cancel();
    };
  }, [onNodesChange, onEdgesChange, nodes, edges, debouncedSave]);

  return (
    <div>
      {/* Render your diagram component here */}
    </div>
  );
};

export default UserFlowDiagram; 