export interface Employee {
  id: string;
  name: string;
  role: string;
  status: string;
  updates?: string | null;
}

export interface EmployeeProject {
  id: string;
  employee_id: string;
  project_id: string;
  allocation_percentage: number;
  project?: {
    name: string;
  };
}