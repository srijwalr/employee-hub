import { Employee, EmployeeProject } from "@/types/employee";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditableEmployeeRowProps {
  employee: Employee;
  editValues: Partial<Employee>;
  employeeProjects: EmployeeProject[];
  projects?: { id: string; name: string }[];
  onEditValuesChange: (values: Partial<Employee>) => void;
  onProjectsChange: (projects: Partial<EmployeeProject>[]) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}

const EditableEmployeeRow = ({
  employee,
  editValues,
  employeeProjects,
  projects,
  onEditValuesChange,
  onProjectsChange,
  onSave,
  onCancel,
}: EditableEmployeeRowProps) => {
  const statuses = ["Available", "Assigned", "On Leave", "Inactive", "On bench"];

  const handleAddProject = () => {
    onProjectsChange([
      ...employeeProjects,
      { project_id: "", allocation_percentage: 0 },
    ]);
  };

  const handleRemoveProject = (index: number) => {
    const newProjects = [...employeeProjects];
    newProjects.splice(index, 1);
    onProjectsChange(newProjects);
  };

  const handleProjectChange = (index: number, field: keyof EmployeeProject, value: any) => {
    const newProjects = [...employeeProjects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onProjectsChange(newProjects);
  };

  return (
    <>
      <td className="p-4 font-medium">{employee.name}</td>
      <td className="p-4">{employee.role}</td>
      <td className="p-4">
        <div className="space-y-2">
          {employeeProjects.map((project, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={project.project_id}
                onValueChange={(value) =>
                  handleProjectChange(index, "project_id", value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="number"
                min="0"
                max="100"
                value={project.allocation_percentage}
                onChange={(e) =>
                  handleProjectChange(
                    index,
                    "allocation_percentage",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-20 px-2 py-1 border rounded"
              />
              <span>%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveProject(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddProject}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </td>
      <td className="p-4">
        <Select
          value={editValues.status || ""}
          onValueChange={(value) =>
            onEditValuesChange({ ...editValues, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="p-4">
        <Textarea
          value={editValues.updates || ""}
          onChange={(e) =>
            onEditValuesChange({ ...editValues, updates: e.target.value })
          }
          className="resize-none"
          rows={2}
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSave(employee.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Check className="h-4 w-4 text-green-500" />
          </button>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </td>
    </>
  );
};

export default EditableEmployeeRow;