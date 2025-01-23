import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Column } from '../types';
import { generateId } from '../lib/utils';

interface BoardState {
  tasks: Record<string, Task>;
  columns: Column[];
  addTask: (columnId: string, title: string, description: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, sourceColumnId: string, destinationColumnId: string) => void;
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
}

const defaultColumns: Column[] = [
  { id: 'todo', title: 'To Do', taskIds: [] },
  { id: 'in-progress', title: 'In Progress', taskIds: [] },
  { id: 'done', title: 'Done', taskIds: [] },
];

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tasks: {},
      columns: defaultColumns,
      addTask: (columnId, title, description) => {
        const taskId = generateId();
        const task: Task = {
          id: taskId,
          title,
          description,
          status: columnId,
          createdAt: new Date(),
        };

        set((state) => {
          const column = state.columns.find((col) => col.id === columnId);
          if (!column) return state;

          return {
            tasks: { ...state.tasks, [taskId]: task },
            columns: state.columns.map((col) =>
              col.id === columnId
                ? { ...col, taskIds: [...col.taskIds, taskId] }
                : col
            ),
          };
        });
      },
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], ...updates },
          },
        })),
      deleteTask: (taskId) =>
        set((state) => {
          const { [taskId]: deletedTask, ...remainingTasks } = state.tasks;
          return {
            tasks: remainingTasks,
            columns: state.columns.map((col) => ({
              ...col,
              taskIds: col.taskIds.filter((id) => id !== taskId),
            })),
          };
        }),
      moveTask: (taskId, sourceColumnId, destinationColumnId) =>
        set((state) => {
          const sourceColumn = state.columns.find((col) => col.id === sourceColumnId);
          const destColumn = state.columns.find((col) => col.id === destinationColumnId);
          if (!sourceColumn || !destColumn) return state;

          return {
            ...state,
            columns: state.columns.map((col) => {
              if (col.id === sourceColumnId) {
                return {
                  ...col,
                  taskIds: col.taskIds.filter((id) => id !== taskId),
                };
              }
              if (col.id === destinationColumnId) {
                return {
                  ...col,
                  taskIds: [...col.taskIds, taskId],
                };
              }
              return col;
            }),
            tasks: {
              ...state.tasks,
              [taskId]: {
                ...state.tasks[taskId],
                status: destinationColumnId,
              },
            },
          };
        }),
      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { id: generateId(), title, taskIds: [] },
          ],
        })),
      deleteColumn: (columnId) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== columnId),
          tasks: Object.fromEntries(
            Object.entries(state.tasks).filter(
              ([_, task]) => task.status !== columnId
            )
          ),
        })),
    }),
    {
      name: 'board-storage',
    }
  )
);