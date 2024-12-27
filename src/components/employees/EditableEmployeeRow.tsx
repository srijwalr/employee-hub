import { Employee } from "@/types/employee";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";

interface EditableEmployeeRowProps {
  employee: Employee;
  editValues: Partial<Employee>;
  projects?: { name: string }[];
  onEditValuesChange: (values: Partial<Employee>) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}

const EditableEmployeeRow = ({
  employee,
  editValues,
  projects,
  onEditValuesChange,
  onSave,
  onCancel,
}: EditableEmployeeRowProps) => {
  const statuses = ["Available", "Assigned", "On Leave", "Inactive", "On bench"];

  return (
    <>
      <td className="p-4 font-medium">{employee.name}</td>
      <td className="p-4">{employee.role}</td>
      <td className="p-4">
        <Select
          value={editValues.project || "no-project"}
          onValueChange={(value) =>
            onEditValuesChange({
              ...editValues,
              project: value === "no-project" ? null : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-project">No Project</SelectItem>
            {projects?.map((project) => (
              <SelectItem key={project.name} value={project.name}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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