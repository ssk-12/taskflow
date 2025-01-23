export interface Task {
  id: string
  title: string
  description: string
  status: string
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
  color: string
}

export interface Board {
  tasks: { [key: string]: Task }
  columns: { [key: string]: Column }
  columnOrder: string[]
}

