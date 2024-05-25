export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdDate: string;
  updatedDate: string;
}
