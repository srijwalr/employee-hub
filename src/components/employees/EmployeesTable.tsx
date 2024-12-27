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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Employee } from "@/types/employee";
import ProjectFilter from "./ProjectFilter";
import EditableEmployeeRow from "./EditableEmployeeRow";
import DisplayEmployeeRow from "./DisplayEmployeeRow";

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

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee.id);
    setEditValues({
      name: employee.name,
      role: employee.role,
      project: employee.project,
      status: employee.status,
      updates: employee.updates,
    });
  };

  const handleSave = async (id: string) => {
    updateMutation.mutate({ id, ...editValues });
  };

  const handleCancel = () => {
    setEditingEmployee(null);
    setEditValues({});
  };

  const statuses = ["Available", "Assigned", "On Leave", "Inactive", "On bench"];

  return (
    <div className="space-y-4">
      <ProjectFilter
        projects={projects}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
      />

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
            <TableHead>Updates</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : employees?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No employees found
              </TableCell>
            </TableRow>
          ) : (
            employees?.map((employee) => (
              <TableRow key={employee.id}>
                {editingEmployee === employee.id ? (
                  <EditableEmployeeRow
                    employee={employee}
                    editValues={editValues}
                    projects={projects}
                    onEditValuesChange={setEditValues}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                ) : (
                  <DisplayEmployeeRow
                    employee={employee}
                    onEdit={handleEdit}
                  />
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesTable;