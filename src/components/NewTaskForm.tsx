import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Plus } from "lucide-react"

interface NewTaskFormProps {
  onSubmit: (title: string) => void
}

export function NewTaskForm({ onSubmit }: NewTaskFormProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title.trim())
      setTitle("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
          className="flex-1"
        />
        <Button type="submit">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

