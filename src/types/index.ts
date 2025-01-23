export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}