
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
import { Employee, EmployeeProject, NewEmployeeProject } from "@/types/employee";
import ProjectFilter from "./ProjectFilter";
import EditableEmployeeRow from "./EditableEmployeeRow";
import DisplayEmployeeRow from "./DisplayEmployeeRow";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const EmployeesTable = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Employee>>({});
  const [editingProjects, setEditingProjects] = useState<NewEmployeeProject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: employeesData, isLoading } = useQuery({
    queryKey: ["employees", selectedProject, selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from("employees")
        .select(`
          *,
          employee_projects:employee_projects(
            id,
            project_id,
            allocation_percentage,
            project:projects(name)
          )
        `);

      if (selectedStatus) {
        query = query.eq("status", selectedStatus);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;

      if (selectedProject) {
        return (data as any[]).filter(employee => 
          employee.employee_projects.some((ep: any) => 
            ep.project?.name === selectedProject
          )
        );
      }

      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
      projects,
    }: {
      id: string;
      updates: Partial<Employee>;
      projects: NewEmployeeProject[];
    }) => {
      // Update employee details
      const { error: employeeError } = await supabase
        .from("employees")
        .update(updates)
        .eq("id", id);

      if (employeeError) throw employeeError;

      // Delete existing project assignments
      const { error: deleteError } = await supabase
        .from("employee_projects")
        .delete()
        .eq("employee_id", id);

      if (deleteError) throw deleteError;

      // Insert new project assignments
      if (projects.length > 0) {
        const { error: projectsError } = await supabase
          .from("employee_projects")
          .insert(
            projects.map((p) => ({
              employee_id: id,
              project_id: p.project_id,
              allocation_percentage: p.allocation_percentage,
            }))
          );

        if (projectsError) throw projectsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      setEditingEmployee(null);
      setEditValues({});
      setEditingProjects([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (employee: Employee & { employee_projects: EmployeeProject[] }) => {
    setEditingEmployee(employee.id);
    setEditValues({
      name: employee.name,
      role: employee.role,
      status: employee.status,
      updates: employee.updates,
    });
    setEditingProjects(
      employee.employee_projects.map(ep => ({
        project_id: ep.project_id,
        allocation_percentage: ep.allocation_percentage
      }))
    );
  };

  const handleSave = async (id: string) => {
    updateMutation.mutate({
      id,
      updates: editValues,
      projects: editingProjects,
    });
  };

  const handleCancel = () => {
    setEditingEmployee(null);
    setEditValues({});
    setEditingProjects([]);
  };

  const statuses = ["Available", "Assigned", "On Leave", "Inactive", "On bench"];

  // Pagination calculations
  const totalEmployees = employeesData?.length || 0;
  const totalPages = Math.ceil(totalEmployees / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmployees = employeesData?.slice(startIndex, endIndex) || [];

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("ellipsis");
      }
    }
    return pages;
  };

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
            <TableHead>Projects</TableHead>
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
          ) : currentEmployees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No employees found
              </TableCell>
            </TableRow>
          ) : (
            currentEmployees.map((employee: any) => (
              <TableRow key={employee.id}>
                {editingEmployee === employee.id ? (
                  <EditableEmployeeRow
                    employee={employee}
                    editValues={editValues}
                    employeeProjects={editingProjects}
                    projects={projects}
                    onEditValuesChange={setEditValues}
                    onProjectsChange={setEditingProjects}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                ) : (
                  <DisplayEmployeeRow
                    employee={employee}
                    employeeProjects={employee.employee_projects}
                    onEdit={() => handleEdit(employee)}
                  />
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}

            {getPageNumbers().map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(Number(page))}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default EmployeesTable;
