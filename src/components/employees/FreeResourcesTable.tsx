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
import { Employee } from "@/types/employee";

const FreeResourcesTable = () => {
  const { data: employees, isLoading } = useQuery({
    queryKey: ["free-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .or('status.eq.Available,status.eq.On bench')
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
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : employees?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              No free resources available
            </TableCell>
          </TableRow>
        ) : (
          employees?.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                {employee.name}
              </TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.status}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default FreeResourcesTable;