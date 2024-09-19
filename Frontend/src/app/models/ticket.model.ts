export interface Ticket {
  id?: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  type?: string;
  resolution?: string;
  assignee: string;
  reporter: string;
  createdDate: string;
  updatedDate?: string;
  dueDate: string;
  closedDate?: string;
  comments?: string;
}
