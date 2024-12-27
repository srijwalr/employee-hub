export interface Employee {
  id: string;
  name: string;
  role: string;
  project: string | null;
  status: string;
  updates?: string | null;
}