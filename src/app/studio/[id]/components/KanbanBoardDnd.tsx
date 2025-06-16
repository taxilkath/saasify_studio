'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { useKanbanStore, Ticket, Column as KanbanColumnType } from '@/lib/kanbanStore';
import { v4 as uuidv4 } from 'uuid';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { DragOverlay } from '@dnd-kit/core';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import debounce from 'lodash.debounce';

type KanbanColumnProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  onAdd: () => void;
  count: number;
};

const KanbanColumn = ({ id, title, children, onAdd, count }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const getColumnColor = (title: string) => {
    switch (title.toLowerCase()) {
      case 'backlog':
        return 'bg-red-600';
      case 'to do':
        return 'bg-orange-500';
      case 'in progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-100 dark:bg-gray-900 rounded-lg p-4 w-[280px] flex flex-col border border-gray-200 dark:border-gray-700 ${isOver ? 'bg-gray-200 dark:bg-gray-800' : ''}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${getColumnColor(title)}`}></div>
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-white uppercase tracking-wide">
          {title}
        </h3>
        <span className="text-xs text-gray-400 font-medium">{count}</span>
      </div>
      <div className="flex flex-col gap-3 min-h-[100px] flex-1">{children}</div>
      <button
        onClick={onAdd}
        className="mt-4 text-xs text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-lg">+</span>
        Add Ticket
      </button>
    </div>
  );
};


const KanbanTicket = ({ ticket, isDragging = false }: { ticket: Ticket; isDragging?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: ticket.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1,
    transition: 'transform 0.2s ease',
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-red-100 border-red-500';
      case 'medium':
        return 'bg-yellow-500 text-yellow-100 border-yellow-500';
      case 'low':
        return 'bg-green-500 text-green-100 border-green-500';
      default:
        return 'bg-gray-500 text-gray-100 border-gray-500';
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing touch-none hover:shadow-lg transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-zinc-900 dark:text-white text-sm leading-tight pr-2">{ticket.title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{ticket.description}</p>

      {ticket.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {ticket.tags.map((tag) => (
            <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>Assignee: {ticket.assignee}</span>
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{ticket.assignee.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

type NewTicketForm = {
  title: string;
  description: string;
  assignee: string;
  priority: string;
  tags: string;
};

function AddTicketDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: NewTicketForm) => void;
}) {
  const [form, setForm] = useState<NewTicketForm>({
    title: '',
    description: '',
    assignee: '',
    priority: 'low',
    tags: '',
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900/90 p-8 rounded-3xl w-[420px] border border-gray-200 dark:border-gray-800 shadow-2xl backdrop-blur-xl relative">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">
          Add New Ticket
        </h2>

        <div className="flex flex-col gap-4">
          <input
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 text-zinc-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <textarea
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 text-zinc-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
          />
          <input
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 text-zinc-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Assignee"
            value={form.assignee}
            onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
          />
          <select
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 text-zinc-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 text-zinc-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(form);
              onClose();
            }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition text-sm font-semibold shadow-md"
          >
            Add Ticket
          </button>
        </div>
      </div>
    </div>
  );
}


function KanbanBoardDnd() {
  const columns = useKanbanStore((state) => state.columns);
  const tickets = useKanbanStore((state) => state.tickets);
  const moveTicket = useKanbanStore((state) => state.moveTicket);
  const addTicket = useKanbanStore((state) => state.addTicket);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addColumnId, setAddColumnId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const initialLoadComplete = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const initializeBoard = useKanbanStore((state) => state.initializeBoard);

  const params = useParams();
  const projectId = params?.id as string;

  // --- SAVE LOGIC ---
  const debouncedSave = useMemo(
    () =>
      debounce(async (boardColumns: KanbanColumnType[], boardTickets: Record<string, Ticket>) => {
        if (!projectId) return;

        const backendColumns: Record<string, { title: string; tickets: Ticket[] }> = {};
        boardColumns.forEach((col) => {
          backendColumns[col.id] = {
            title: col.title,
            tickets: col.ticketIds.map((id: string) => boardTickets[id]).filter(Boolean),
          };
        });

        setIsSaving(true);
        try {
          await fetch(`/api/kanban/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ columns: backendColumns }),
          });
        } catch (error) {
          console.error('Failed to save kanban board', error);
        } finally {
          setIsSaving(false);
        }
      }, 1500),
    [projectId]
  );

  useEffect(() => {
    if (!initialLoadComplete.current || isLoading) {
      return;
    }
    debouncedSave(columns, tickets);
    return () => debouncedSave.cancel();
  }, [columns, tickets, isLoading, debouncedSave]);


  // --- FETCH LOGIC ---
  useEffect(() => {
    async function fetchKanban() {
      if (!projectId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/kanban/${projectId}`);
        const json = await res.json();
        
        if (!json.success || !json.data || !json.data.columns) {
            initializeBoard([], {});
            return;
        }

        const backendColumns = json.data.columns;

        const columns = Object.entries(backendColumns).map(([key, col]: [string, any]) => ({
          id: key,
          title: col.title,
          ticketIds: (col.tickets || []).map((t: any) => t.id),
        }));

        const tickets: Record<string, Ticket> = {};
        Object.values(backendColumns).forEach((col: any) => {
          (col.tickets || []).forEach((t: any) => {
            tickets[t.id] = {
              id: t.id,
              title: t.title,
              description: t.description,
              tags: t.tags || [],
              priority: t.priority || 'low',
              assignee: t.assignee || 'Unassigned',
            };
          });
        });

        initializeBoard(columns, tickets);
      } catch (err) {
        console.error("Failed to load Kanban data:", err);
        initializeBoard([], {}); // Start with an empty board on error
      } finally {
        setIsLoading(false);
        initialLoadComplete.current = true;
      }
    }
    fetchKanban();
  }, [projectId, initializeBoard]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="flex gap-6 overflow-x-auto pb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 w-[280px] flex flex-col border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex flex-col gap-3 min-h-[200px]">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const ticket = tickets[active.id as string];
    if (ticket) {
      setActiveTicket(ticket);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTicket(null);

    if (!over) return;

    if (active.id !== over.id) {
      moveTicket(active.id as string, over.id as string);
    }
  };

  const handleAddTicket = (columnId: string) => {
    setAddColumnId(columnId);
    setDialogOpen(true);
  };

  const handleDialogSubmit = (form: NewTicketForm) => {
    if (!addColumnId) return;
    const newTicket: Ticket = {
      id: uuidv4(),
      title: form.title,
      description: form.description,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      priority: form.priority,
      assignee: form.assignee,
    };
    addTicket(addColumnId, newTicket);
  };

  return (
    <div className="min-h-screen">
      <div className="p-6">
         <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-card/80 border border-border backdrop-blur-sm">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin"/>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-green-500"/>
                <span>All changes saved</span>
              </>
            )}
          </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                count={column.ticketIds.length}
                onAdd={() => handleAddTicket(column.id)}
              >
                {column.ticketIds.map((ticketId) => {
                  const ticket = tickets[ticketId];
                  if (!ticket) return null;
                  return (
                    <KanbanTicket
                      key={ticketId}
                      ticket={ticket}
                      isDragging={activeTicket?.id === ticketId}
                    />
                  );
                })}
              </KanbanColumn>
            ))}
          </div>

          <DragOverlay style={{ zIndex: 1000 }}>
            {activeTicket ? (
              <div className="rotate-2 scale-105 shadow-2xl border border-blue-500">
                <KanbanTicket ticket={activeTicket} />
              </div>
            ) : null}
          </DragOverlay>

        </DndContext>
      </div>

      <AddTicketDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}

export default KanbanBoardDnd;