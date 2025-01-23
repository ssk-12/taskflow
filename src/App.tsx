import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Plus, Search } from "lucide-react"
import { useBoardStore } from "./store/board"
import Column from "./components/Column"
import TaskCard from "./components/TaskCard"
import type { Task } from "./types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area"

export default function App() {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")

  const { tasks, columns, moveTask, addColumn, deleteColumn } = useBoardStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks[event.active.id as string]
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const activeTask = tasks[active.id as string]
      const activeColumn = columns.find((col) => col.taskIds.includes(active.id as string))

      if (activeTask && activeColumn) {
        moveTask(active.id as string, activeColumn.id, over.id as string)
      }
    }

    setActiveTask(null)
  }

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle)
      setNewColumnTitle("")
      setIsAddingColumn(false)
    }
  }

  const filteredTasks = searchQuery
    ? Object.values(tasks).filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : null

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-8 max-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Project Board</h1>
        
        <div className="flex items-center space-x-4">
         <Dialog open={isAddingColumn} onOpenChange={setIsAddingColumn}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex  w-80 shrink-0  items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600"
              >
                <Plus className="mb-2 h-5 w-5" />
                Add new column
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Column</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                <Input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Enter column title..."
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingColumn(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddColumn}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {filteredTasks ? (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Search Results</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="w-full h-full flex-grow">
            <ScrollArea className="w-full " >
              <div className="flex space-x-4 p-4 flex-grow-1">
                {columns.map((column) => (
                  <Column
                    key={column.id}
                    column={column}
                    onDelete={columns.length > 1 ? () => deleteColumn(column.id) : undefined}
                  />
                ))}


              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
        </DndContext>
      )}
    </div>
  )
}

