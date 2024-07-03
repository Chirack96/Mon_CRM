import {User} from "./user.model";

export interface Training {
  id: number;
  title: string;
  description: string;
  date: Date;
  users?: User[];
}
