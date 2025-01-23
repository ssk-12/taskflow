"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "react-beautiful-dnd"
import { Column } from "./Column"
import { NewColumnForm } from "./NewColumnForm"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import type { Board as BoardType, Task } from "../lib/types"
import { AddTaskDialog } from "./AddTaskDialog"

const initialBoard: BoardType = {
  tasks: {},
  columns: {
    "column-1": { id: "column-1", title: "To Do", taskIds: [], color: "bg-blue-100" },
    "column-2": { id: "column-2", title: "In Progress", taskIds: [], color: "bg-yellow-100" },
    "column-3": { id: "column-3", title: "Done", taskIds: [], color: "bg-green-100" },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
}

export function Board() {
  const [board, setBoard] = useState<BoardType>(initialBoard)
  const [isNewColumnFormOpen, setIsNewColumnFormOpen] = useState(false)

  useEffect(() => {
    const savedBoard = localStorage.getItem("board")
    if (savedBoard) {
      setBoard(JSON.parse(savedBoard))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(board))
  }, [board])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const startColumn = board.columns[source.droppableId]
    const finishColumn = board.columns[destination.droppableId]

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      }

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      }

      setBoard(newBoard)
      return
    }

    // Moving from one list to another
    const startTaskIds = Array.from(startColumn.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...startColumn,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finishColumn.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finishColumn,
      taskIds: finishTaskIds,
    }

    const newBoard = {
      ...board,
      columns: {
        ...board.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }

    setBoard(newBoard)
  }

  const addTask = (columnId: string, task: Task) => {
    const column = board.columns[columnId]
    const newTaskIds = [...column.taskIds, task.id]
    const newBoard = {
      ...board,
      tasks: {
        ...board.tasks,
        [task.id]: task,
      },
      columns: {
        ...board.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    }
    setBoard(newBoard)
  }

  const addColumn = (title: string) => {
    const newColumnId = `column-${Date.now()}`
    const newColumn: BoardType['columns'][string] = {
      id: newColumnId,
      title,
      taskIds: [],
      color: "bg-gray-100", // Default color or any other appropriate value
    }
    const newBoard = {
      ...board,
      columns: {
        ...board.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: [...board.columnOrder, newColumnId],
    }
    setBoard(newBoard)
    setIsNewColumnFormOpen(false)
  }

  const addTaskToColumn = (task: Task) => {
    const column = board.columns[board.columnOrder.find((id) => board.columns[id].title === task.status) || ""]
    addTask(column.id, task)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-screen bg-gray-100">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Project Board</h1>
          <AddTaskDialog board={board} onAddTask={addTaskToColumn} />
        </header>
        <main className="flex-1 overflow-x-auto p-4">
          <div className="flex space-x-4">
            {board.columnOrder.map((columnId) => {
              const column = board.columns[columnId]
              const tasks = column.taskIds.map((taskId) => board.tasks[taskId])
              return <Column key={column.id} column={column} tasks={tasks} addTask={addTask} board={board} />
            })}
            {isNewColumnFormOpen ? (
              <NewColumnForm onSubmit={addColumn} onCancel={() => setIsNewColumnFormOpen(false)} />
            ) : (
              <Button onClick={() => setIsNewColumnFormOpen(true)} className="h-10 mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Column
              </Button>
            )}
          </div>
        </main>
      </div>
    </DragDropContext>
  )
}

