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
import { format } from "date-fns";

type FreeResource = {
  id: string;
  employee_id: string;
  available_from: string;
  available_until: string | null;
  notes: string | null;
  employees: {
    name: string;
    role: string;
  };
};

const FreeResourcesTable = () => {
  const { data: freeResources, isLoading } = useQuery({
    queryKey: ["free-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("free_resources")
        .select(`
          *,
          employees (
            name,
            role
          )
        `)
        .order("available_from", { ascending: true });

      if (error) throw error;
      return data as FreeResource[];
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Available From</TableHead>
          <TableHead>Available Until</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : freeResources?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No free resources found
            </TableCell>
          </TableRow>
        ) : (
          freeResources?.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell>{resource.employees.name}</TableCell>
              <TableCell>{resource.employees.role}</TableCell>
              <TableCell>
                {format(new Date(resource.available_from), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {resource.available_until
                  ? format(new Date(resource.available_until), "MMM d, yyyy")
                  : "—"}
              </TableCell>
              <TableCell>{resource.notes || "—"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default FreeResourcesTable;