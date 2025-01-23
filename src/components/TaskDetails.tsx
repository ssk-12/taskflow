import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import type { Task, Board } from "../lib/types"

interface TaskDetailsProps {
  taskId: string
}

export function TaskDetails({ taskId }: TaskDetailsProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [board, setBoard] = useState<Board | null>(null)

  useEffect(() => {
    const savedBoard = localStorage.getItem("board")
    if (savedBoard) {
      const parsedBoard = JSON.parse(savedBoard)
      setBoard(parsedBoard)
      setTask(parsedBoard.tasks[taskId])
    }
  }, [taskId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (task) {
      setTask({ ...task, [e.target.name]: e.target.value })
    }
  }

  const handleStatusChange = (value: string) => {
    if (task) {
      setTask({ ...task, status: value })
    }
  }

  const handleSave = () => {
    if (task && board) {
      const newBoard = {
        ...board,
        tasks: {
          ...board.tasks,
          [task.id]: task,
        },
      }
      localStorage.setItem("board", JSON.stringify(newBoard))
      window.location.href = "/"
    }
  }

  const handleDelete = () => {
    if (task && board) {
      const newTasks = { ...board.tasks }
      delete newTasks[task.id]
      const newColumns = Object.fromEntries(
        Object.entries(board.columns).map(([columnId, column]) => [
          columnId,
          {
            ...column,
            taskIds: column.taskIds.filter((id) => id !== task.id),
          },
        ]),
      )
      const newBoard = {
        ...board,
        tasks: newTasks,
        columns: newColumns,
      }
      localStorage.setItem("board", JSON.stringify(newBoard))
      window.location.href = "/"
    }
  }

  function DeleteTaskDialog({ onDelete }: { onDelete: () => void }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Task</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  if (!task || !board) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{task.title}</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <Input id="title" name="title" value={task.title} onChange={handleChange} className="w-full" />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {board.columnOrder.map((columnId) => (
                <SelectItem key={columnId} value={board.columns[columnId].title}>
                  {board.columns[columnId].title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full"
            rows={4}
          />
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={handleSave}>Save Changes</Button>
          <DeleteTaskDialog onDelete={handleDelete} />
        </div>
      </div>
    </div>
  )
}

