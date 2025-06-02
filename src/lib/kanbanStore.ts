import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  priority: string;
  assignee: string;
};

type Column = {
  id: string;
  title: string;
  ticketIds: string[];
};

type KanbanState = {
  columns: Column[];
  tickets: Record<string, Ticket>;
  moveTicket: (ticketId: string, toColumnId: string) => void;
  addTicket: (columnId: string, ticket: Ticket) => void;
};

export const useKanbanStore = create<KanbanState>((set) => ({
  columns: [
    { id: 'backlog', title: 'Backlog', ticketIds: [] },
    { id: 'todo', title: 'To Do', ticketIds: [] },
    { id: 'inprogress', title: 'In Progress', ticketIds: [] },
    { id: 'done', title: 'Completed', ticketIds: [] },
  ],
  tickets: {},
  moveTicket: (ticketId, toColumnId) =>
    set((state) => {
      // Remove from current column
      const fromColumn = state.columns.find((col) =>
        col.ticketIds.includes(ticketId)
      );
      if (!fromColumn) return state;

      fromColumn.ticketIds = fromColumn.ticketIds.filter((id) => id !== ticketId);

      // Add to target column
      const toColumn = state.columns.find((col) => col.id === toColumnId);
      if (toColumn) {
        toColumn.ticketIds.push(ticketId);
      }

      return {
        ...state,
        columns: [...state.columns],
      };
    }),
  addTicket: (columnId, ticket) =>
    set((state) => {
      const column = state.columns.find((col) => col.id === columnId);
      if (!column) return state;

      return {
        columns: state.columns.map((col) =>
          col.id === columnId
            ? { ...col, ticketIds: [...col.ticketIds, ticket.id] }
            : col
        ),
        tickets: {
          ...state.tickets,
          [ticket.id]: ticket,
        },
      };
    }),
}));
