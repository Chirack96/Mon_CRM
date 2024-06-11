export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  assigneeEmail: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Comment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
  taskId?: number; // Ajout de taskId
}

export interface Attachment {
  id: number;
  filename: string;
  fileUrl: string;
}
