import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Trash2 } from 'lucide-react';
import type { Column as ColumnType } from '../types';
import { useBoardStore } from '../store/board';
import TaskCard from './TaskCard';
import { cn } from '../lib/utils';

interface ColumnProps {
  column: ColumnType;
  onDelete?: () => void;
}

export default function Column({ column, onDelete }: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { tasks, addTask } = useBoardStore();
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const columnTasks = column.taskIds.map((id) => tasks[id]).filter(Boolean);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(column.id, newTaskTitle, '');
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-full w-80 shrink-0 flex-col rounded-lg bg-gray-100 p-4',
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-medium text-gray-900">{column.title}</h2>
          <span className="text-sm text-gray-500">
            {columnTasks.length} {columnTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        
        {onDelete && (
          <button
            onClick={onDelete}
            className="rounded p-1 hover:bg-gray-200"
            aria-label={`Delete ${column.title} column`}
          >
            <Trash2 className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        <SortableContext
          items={columnTasks}
          strategy={verticalListSortingStrategy}
        >
          {columnTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      {isAdding ? (
        <div className="mt-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTask();
              if (e.key === 'Escape') setIsAdding(false);
            }}
            autoFocus
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="rounded px-3 py-1 text-sm hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new task
        </button>
      )}
    </div>
  );
}