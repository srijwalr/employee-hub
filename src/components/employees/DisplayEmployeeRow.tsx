import { Employee, EmployeeProject } from "@/types/employee";
import { Pencil } from "lucide-react";

interface DisplayEmployeeRowProps {
  employee: Employee;
  employeeProjects: EmployeeProject[];
  onEdit: (employee: Employee) => void;
}

const DisplayEmployeeRow = ({ employee, employeeProjects, onEdit }: DisplayEmployeeRowProps) => {
  const projectsDisplay = employeeProjects.length > 0
    ? employeeProjects.map(ep => ep.project?.name || '—').join(', ')
    : '—';

  return (
    <>
      <td className="p-4 font-medium">{employee.name}</td>
      <td className="p-4">{employee.role}</td>
      <td className="p-4">{projectsDisplay}</td>
      <td className="p-4">{employee.status}</td>
      <td className="p-4">{employee.updates || "—"}</td>
      <td className="p-4">
        <button
          onClick={() => onEdit(employee)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </td>
    </>
  );
};

export default DisplayEmployeeRow;