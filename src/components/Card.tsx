import { Draggable, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd"
import type { Task } from "../lib/types"

interface CardProps {
  task: Task
  index: number
}

export function Card({ task, index }: CardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
      <a href={`/task/${task.id}`}>
        <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-white p-4 mb-2 rounded-lg shadow transition-shadow duration-200 ${
          snapshot.isDragging ? "shadow-lg" : "shadow-sm"
        } hover:shadow-md`}
        >
        <h3 className="font-semibold text-gray-800 mb-2">{task.title}</h3>
        <p className="text-sm text-gray-600 truncate">{task.description}</p>
        </div>
      </a>
      )}
    </Draggable>
  )
}

