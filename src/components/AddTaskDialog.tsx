import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Plus } from "lucide-react"
import type { Board, Task } from "../lib/types/index"

interface AddTaskDialogProps {
  board: Board
  onAddTask: (task: Task) => void
  defaultStatus?: string
}

export function AddTaskDialog({ board, onAddTask, defaultStatus }: AddTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState(defaultStatus || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && status) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        status,
      }
      onAddTask(newTask)
      setIsOpen(false)
      setTitle("")
      setDescription("")
      setStatus(defaultStatus || "")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {!defaultStatus && (
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {board.columnOrder.map((columnId) => (
                  <SelectItem key={columnId} value={board.columns[columnId].title}>
                    {board.columns[columnId].title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

