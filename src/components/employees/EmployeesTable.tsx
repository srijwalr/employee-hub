import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Filter, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Employee = {
  id: string;
  name: string;
  role: string;
  project: string | null;
  status: string;
};

const EmployeesTable = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Employee>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees", selectedProject, selectedStatus],
    queryFn: async () => {
      let query = supabase.from("employees").select("*");

      if (selectedProject) {
        query = query.eq("project", selectedProject);
      }
      if (selectedStatus) {
        query = query.eq("status", selectedStatus);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data as Employee[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: { id: string } & Partial<Employee>) => {
      const { data, error } = await supabase
        .from("employees")
        .update(updates)
        .eq("id", updates.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      setEditingEmployee(null);
      setEditValues({});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
    },
  });

  const statuses = ["Available", "Assigned", "On Leave", "Inactive", "On bench"];

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee.id);
    setEditValues({
      name: employee.name,
      role: employee.role,
      project: employee.project,
      status: employee.status,
    });
  };

  const handleSave = async (id: string) => {
    updateMutation.mutate({ id, ...editValues });
  };

  const handleCancel = () => {
    setEditingEmployee(null);
    setEditValues({});
  };

  return (
    <div className="space-y-4">
      <div className="w-[200px]">
        <Select
          value={selectedProject || "all"}
          onValueChange={(value) => setSelectedProject(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects?.map((project) => (
              <SelectItem key={project.name} value={project.name}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Assigned Project</TableHead>
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2">
                  Status
                  <Filter className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
                    All Statuses
                  </DropdownMenuItem>
                  {statuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : employees?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No employees found
              </TableCell>
            </TableRow>
          ) : (
            employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  {editingEmployee === employee.id ? (
                    <Input
                      value={editValues.name || ""}
                      onChange={(e) =>
                        setEditValues({ ...editValues, name: e.target.value })
                      }
                    />
                  ) : (
                    employee.name
                  )}
                </TableCell>
                <TableCell>
                  {editingEmployee === employee.id ? (
                    <Input
                      value={editValues.role || ""}
                      onChange={(e) =>
                        setEditValues({ ...editValues, role: e.target.value })
                      }
                    />
                  ) : (
                    employee.role
                  )}
                </TableCell>
                <TableCell>
                  {editingEmployee === employee.id ? (
                    <Select
                      value={editValues.project || ""}
                      onValueChange={(value) =>
                        setEditValues({ ...editValues, project: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Project</SelectItem>
                        {projects?.map((project) => (
                          <SelectItem key={project.name} value={project.name}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    employee.project || "—"
                  )}
                </TableCell>
                <TableCell>
                  {editingEmployee === employee.id ? (
                    <Select
                      value={editValues.status || ""}
                      onValueChange={(value) =>
                        setEditValues({ ...editValues, status: value })
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
                  ) : (
                    employee.status
                  )}
                </TableCell>
                <TableCell>
                  {editingEmployee === employee.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSave(employee.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(employee)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesTable;