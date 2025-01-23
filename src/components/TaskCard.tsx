import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical } from 'lucide-react';
import type { Task } from '../types';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const createdAtDate = new Date(task.createdAt);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg bg-white p-4'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-gray-500" />
      </div>

      <Link to={`/task/${task.id}`} className="block">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {task.description}
        </p>

        <div className="mt-4 flex items-center text-xs text-gray-500">
          <Calendar className="mr-1.5 h-4 w-4" />
          <time dateTime={createdAtDate.toISOString()}>
            {createdAtDate.toLocaleDateString()}
          </time>
        </div>
      </Link>
    </div>
  );
}

export default memo(TaskCard);