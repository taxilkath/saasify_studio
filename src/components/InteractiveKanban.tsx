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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ 
    id: ticket.id, 
    data: { ticket } 
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 200ms ease',
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 bg-white dark:bg-zinc-800/90 rounded-lg text-xs
        shadow-sm hover:shadow-md
        border border-zinc-200 dark:border-zinc-700
        transition-all duration-200 ease-in-out
        cursor-grab active:cursor-grabbing
        ${isOverlay ? 'shadow-xl scale-105 rotate-3 border-purple-500/50 bg-white dark:bg-zinc-800' : ''}
        hover:border-purple-500/30
        space-y-2
      `}
    >
      <p className="text-zinc-800 dark:text-zinc-200 font-medium">{ticket.title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <PriorityBadge priority={ticket.priority} />
        {ticket.tags.map(tag => (
          <span 
            key={tag} 
            className="px-1.5 py-0.5 text-[10px] bg-zinc-100 dark:bg-zinc-700 
              rounded-full text-zinc-600 dark:text-zinc-300
              border border-zinc-200 dark:border-zinc-600"
          >
            {tag}
          </span>
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
      className={`
        bg-zinc-50 dark:bg-zinc-900/50 
        p-4 rounded-xl
        border border-zinc-200 dark:border-zinc-800
        transition-all duration-200 ease-in-out
        ${isOver ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500/30 scale-[1.02]' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{column.title}</h4>
        <span className="text-xs px-2 py-1 bg-zinc-200/50 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
          {column.tickets.length}
        </span>
      </div>
      <div className="space-y-3 min-h-[120px]">
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
  const [hasMounted, setHasMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 100,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveTicket(active.data.current?.ticket || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTicket(null);

    if (!over || active.id === over.id) return;

    setColumns(prev => {
      const newColumns = prev.map(col => ({ ...col, tickets: [...col.tickets] }));
      const sourceCol = newColumns.find(col => col.tickets.some(t => t.id === active.id));
      const destCol = newColumns.find(col => col.id === over.id);

      if (!sourceCol || !destCol) return prev;

      const ticketIndex = sourceCol.tickets.findIndex(t => t.id === active.id);
      const [movedTicket] = sourceCol.tickets.splice(ticketIndex, 1);
      destCol.tickets.push(movedTicket);

      return newColumns;
    });
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        {columns.map(col => (
          <Column key={col.id} column={col} />
        ))}
      </div>
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'ease',
      }}>
        {activeTicket ? <Ticket ticket={activeTicket} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}