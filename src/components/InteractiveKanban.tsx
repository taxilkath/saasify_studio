// src/components/InteractiveKanban.tsx

'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type TicketData = {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  tags: string[];
};

type ColumnData = {
  id: string;
  title: string;
  tickets: TicketData[];
};

const initialColumns: ColumnData[] = [
  {
    id: 'todo',
    title: 'To Do',
    tickets: [
      { id: 't1', title: 'Implement User Auth', priority: 'High', tags: ['Backend'] },
      { id: 't2', title: 'Setup Database Schema', priority: 'High', tags: [] },
    ],
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    tickets: [{ id: 't3', title: 'Dashboard UI', priority: 'Medium', tags: ['UI'] }],
  },
  {
    id: 'review',
    title: 'In Review',
    tickets: [],
  },
  {
    id: 'done',
    title: 'Done',
    tickets: [],
  },
];

const PriorityBadge = ({ priority }: { priority: 'High' | 'Medium' | 'Low' }) => {
  const colors = {
    High: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
    Medium: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    Low: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
  };
  return <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-semibold ${colors[priority]}`}>{priority}</span>;
};

const Ticket = ({ ticket, isOverlay = false }: { ticket: TicketData; isOverlay?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: ticket.id, data: { ticket } });
  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-2 bg-white dark:bg-zinc-800 rounded text-xs shadow-md space-y-1.5 cursor-grab active:cursor-grabbing ${isOverlay ? 'ring-2 ring-purple-500' : ''}`}
    >
      <p className="text-zinc-800 dark:text-zinc-200">{ticket.title}</p>
      <div className="flex items-center gap-2">
        <PriorityBadge priority={ticket.priority} />
        {ticket.tags.map(tag => (
          <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-zinc-200 dark:bg-zinc-700 rounded-full text-zinc-600 dark:text-zinc-300">{tag}</span>
        ))}
      </div>
    </div>
  );
};

const Column = ({ column }: { column: ColumnData }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-zinc-100 dark:bg-black/50 p-3 rounded-lg border border-zinc-200 dark:border-white/10 space-y-2 transition-colors ${isOver ? 'bg-purple-500/10' : ''}`}
    >
      <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 px-1">{column.title}</h4>
      <div className="space-y-2 min-h-[100px]">
        {column.tickets.map(ticket => (
          <Ticket key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default function InteractiveKanban() {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumns);
  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (event: any) => {
    setActiveTicket(event.active.data.current.ticket);
  };
  useEffect(() => {
    setHasMounted(true);
  }, []); const [hasMounted, setHasMounted] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTicket(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setColumns(prev => {
      const newColumns = prev.map(col => ({ ...col, tickets: [...col.tickets] }));
      const activeColumn = newColumns.find(col => col.tickets.some(t => t.id === active.id));
      const overColumn = newColumns.find(col => col.id === over.id);

      if (!activeColumn || !overColumn) return prev;

      const activeIndex = activeColumn.tickets.findIndex(t => t.id === active.id);
      const [movedTicket] = activeColumn.tickets.splice(activeIndex, 1);
      overColumn.tickets.push(movedTicket);

      return newColumns;
    });
  };
  if (!hasMounted) {
    // Prevents SSR rendering of the DndContext, which causes hydration errors.
    return null;
  }
  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        {columns.map(col => (
          <Column key={col.id} column={col} />
        ))}
      </div>
      <DragOverlay>
        {activeTicket ? <Ticket ticket={activeTicket} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}