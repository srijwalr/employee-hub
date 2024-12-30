export interface Employee {
  id: string;
  name: string;
  role: string;
  status: string;
  updates?: string | null;
  created_at: string;
  employee_projects?: EmployeeProject[];
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

export type NewEmployeeProject = {
  project_id: string;
  allocation_percentage: number;
};