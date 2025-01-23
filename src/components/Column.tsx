import { Droppable } from "react-beautiful-dnd"
import { Card } from "./Card"
import { AddTaskDialog } from "./AddTaskDialog"
import { Badge } from "./ui/badge"
import type { Column as ColumnType, Task, Board } from "../lib/types"

interface ColumnProps {
  column: ColumnType
  tasks: Task[]
  addTask: (columnId: string, task: Task) => void
  board: Board
}

export function Column({ column, tasks, addTask, board }: ColumnProps) {
  return (
    <div className={`p-4 rounded-lg shadow-md w-72 ${column.color}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{column.title}</h2>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[200px]">
            {tasks.map((task, index) => (
              <Card key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <AddTaskDialog board={board} onAddTask={(task) => addTask(column.id, task)} defaultStatus={column.title} />
    </div>
  )
}

