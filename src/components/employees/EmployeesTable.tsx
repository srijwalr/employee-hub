import { useQuery } from "@tanstack/react-query";
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
import { Filter } from "lucide-react";

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

  const statuses = ["Available", "Assigned", "On Leave", "Inactive"];

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : employees?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No employees found
              </TableCell>
            </TableRow>
          ) : (
            employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  {employee.name}
                </TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.project || "—"}</TableCell>
                <TableCell>{employee.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesTable;