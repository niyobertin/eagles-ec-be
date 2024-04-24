export interface IUser {
  id?: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
