import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface NewColumnFormProps {
  onSubmit: (title: string) => void
  onCancel: () => void
}

export function NewColumnForm({ onSubmit, onCancel }: NewColumnFormProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title.trim())
      setTitle("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-muted p-4 rounded-lg shadow-md w-72">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New column title"
        className="mb-2"
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Column</Button>
      </div>
    </form>
  )
}

