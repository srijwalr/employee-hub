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

type Employee = {
  id: string;
  name: string;
  role: string;
  project: string | null;
  status: string | null;
};

const EmployeesTable = () => {
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Employee[];
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Assigned Project</TableHead>
          <TableHead>Status</TableHead>
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
              <TableCell>{employee.status || "Active"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default EmployeesTable;