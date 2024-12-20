import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";

interface Project {
  id: string;
  name: string;
  code: string;
  status: string | null;
  allocation: number | null;
  work_status_comment: string | null;
  deadline: string | null;
}

interface EditableProjectRowProps {
  project: Project;
  editValues: Partial<Project>;
  onEditValuesChange: (values: Partial<Project>) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}

const EditableProjectRow = ({
  project,
  editValues,
  onEditValuesChange,
  onSave,
  onCancel,
}: EditableProjectRowProps) => {
  const statuses = ["Planning", "In Progress", "Completed", "On Hold", "Cancelled"];

  return (
    <>
      <td className="p-4">
        <Input
          value={editValues.name || ""}
          onChange={(e) =>
            onEditValuesChange({ ...editValues, name: e.target.value })
          }
        />
      </td>
      <td className="p-4">
        <Input
          value={editValues.code || ""}
          onChange={(e) =>
            onEditValuesChange({ ...editValues, code: e.target.value })
          }
        />
      </td>
      <td className="p-4">
        <Select
          value={editValues.status || ""}
          onValueChange={(value) =>
            onEditValuesChange({ ...editValues, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
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
        <Input
          type="number"
          value={editValues.allocation?.toString() || ""}
          onChange={(e) =>
            onEditValuesChange({
              ...editValues,
              allocation: e.target.value ? parseInt(e.target.value) : null,
            })
          }
        />
      </td>
      <td className="p-4">
        <Input
          value={editValues.work_status_comment || ""}
          onChange={(e) =>
            onEditValuesChange({
              ...editValues,
              work_status_comment: e.target.value,
            })
          }
        />
      </td>
      <td className="p-4">
        <Input
          type="date"
          value={editValues.deadline?.split("T")[0] || ""}
          onChange={(e) =>
            onEditValuesChange({ ...editValues, deadline: e.target.value })
          }
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSave(project.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Check className="h-4 w-4 text-green-500" />
          </button>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </td>
    </>
  );
};

export default EditableProjectRow;