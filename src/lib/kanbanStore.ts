import { create } from 'zustand';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  priority: string;
  assignee: string;
};

export type KanbanColumn = {
  id: string;
  title: string;
  ticketIds: string[];
};

interface KanbanState {
  columns: KanbanColumn[];
  tickets: Record<string, Ticket>;
  setColumns: (columns: KanbanColumn[]) => void;
  setTickets: (tickets: Record<string, Ticket>) => void;
  moveTicket: (activeId: string, overId: string) => void;
}

const initialColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', ticketIds: ['t1', 't2', 't3'] },
  { id: 'in-progress', title: 'In Progress', ticketIds: ['t4'] },
  { id: 'done', title: 'Done', ticketIds: ['t5'] },
];

const initialTickets: Record<string, Ticket> = {
  t1: {
    id: 't1',
    title: 'Setup Customer Touchpoints',
    description: 'Integrate live chat widget and social media webhooks.',
    tags: ['integration'],
    priority: 'high',
    assignee: 'Sarah',
  },
  t2: {
    id: 't2',
    title: 'Create API Gateway Service',
    description: 'Build REST endpoints and route tickets to backend.',
    tags: ['backend', 'api'],
    priority: 'medium',
    assignee: 'Jake',
  },
  t3: {
    id: 't3',
    title: 'Design Ticket Model',
    description: 'Define schema for ticket content and status.',
    tags: ['database', 'design'],
    priority: 'low',
    assignee: 'Nina',
  },
  t4: {
    id: 't4',
    title: 'Implement Sentiment Analysis',
    description: 'Integrate NLP service for detecting ticket sentiment.',
    tags: ['AI', 'NLP'],
    priority: 'high',
    assignee: 'Alex',
  },
  t5: {
    id: 't5',
    title: 'Deploy Staging Environment',
    description: 'Prepare Dockerized staging setup on DigitalOcean.',
    tags: ['devops'],
    priority: 'medium',
    assignee: 'Emily',
  },
};

export const useKanbanStore = create<KanbanState>((set, get) => ({
  columns: initialColumns,
  tickets: initialTickets,
  setColumns: (columns) => set({ columns }),
  setTickets: (tickets) => set({ tickets }),
  moveTicket: (activeId, overId) => {
    const columns = [...get().columns];
    // Find source column index
    const fromColIdx = columns.findIndex((col) => col.ticketIds.includes(activeId));
    if (fromColIdx === -1) return;
    // Check if dropped into empty column (overId matches column id)
    const isDroppedInEmptyColumn = columns.some((col) => col.id === overId);
    const toColIdx = isDroppedInEmptyColumn
      ? columns.findIndex((col) => col.id === overId)
      : columns.findIndex((col) => col.ticketIds.includes(overId));
    if (toColIdx === -1) return;
    const newColumns = [...columns];
    const fromColumn = { ...newColumns[fromColIdx] };
    const toColumn = { ...newColumns[toColIdx] };
    // Remove from old column
    fromColumn.ticketIds = fromColumn.ticketIds.filter((id) => id !== activeId);
    // Insert into target column
    if (isDroppedInEmptyColumn) {
      toColumn.ticketIds.push(activeId);
    } else {
      const overIndex = toColumn.ticketIds.indexOf(overId);
      toColumn.ticketIds.splice(overIndex, 0, activeId);
    }
    newColumns[fromColIdx] = fromColumn;
    newColumns[toColIdx] = toColumn;
    set({ columns: newColumns });
  },
})); 