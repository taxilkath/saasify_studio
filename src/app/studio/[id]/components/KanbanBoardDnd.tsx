import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useKanbanStore } from '@/lib/kanbanStore';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  priority: string;
  assignee: string;
};

const KanbanTicket = ({ ticket, id }: { ticket: Ticket; id: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 150ms ease'
      : 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease',
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 50 : 1,
    boxShadow: isDragging
      ? '0 12px 40px rgba(80,80,255,0.25), 0 6px 20px rgba(0,0,0,0.2)'
      : '0 2px 6px rgba(0,0,0,0.12)',
    scale: isDragging ? 1.03 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-zinc-800 rounded-lg p-4 shadow flex flex-col gap-2 border border-zinc-700 cursor-grab active:cursor-grabbing transition-transform duration-200 ease-out`}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-white">{ticket.title}</span>
        <span
          className={`text-xs px-2 py-1 rounded ${
            ticket.priority === 'high'
              ? 'bg-red-500 text-white'
              : ticket.priority === 'medium'
              ? 'bg-yellow-500 text-black'
              : 'bg-green-500 text-white'
          }`}
        >
          {ticket.priority}
        </span>
      </div>
      <p className="text-zinc-400 text-sm">{ticket.description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {ticket.tags.map((tag) => (
          <span
            key={tag}
            className="bg-indigo-700 text-xs text-white px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="text-xs text-zinc-300 mt-2">Assignee: {ticket.assignee}</div>
    </div>
  );
};

function KanbanBoardDnd() {
  const columns = useKanbanStore((state) => state.columns);
  const tickets = useKanbanStore((state) => state.tickets);
  const moveTicket = useKanbanStore((state) => state.moveTicket);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    moveTicket(active.id as string, over.id as string);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-zinc-900 rounded-xl shadow-lg p-4 min-w-[300px] flex-1 border border-zinc-800"
          >
            <h3 className="text-lg font-bold mb-4 text-white">{column.title}</h3>
            <SortableContext items={column.ticketIds} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-4 min-h-[60px]">
                {column.ticketIds.map((ticketId) => (
                  <KanbanTicket key={ticketId} id={ticketId} ticket={tickets[ticketId]} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}

export default KanbanBoardDnd; 