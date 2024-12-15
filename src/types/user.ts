export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: 'admin' | 'employee';
  created_at: string;
}