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

const EmployeeChangeHistory = () => {
  const { data: changes, isLoading } = useQuery({
    queryKey: ["employee-changes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("change_history")
        .select("*")
        .eq("table_name", "employees")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading history...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Recent Changes</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Change Type</TableHead>
            <TableHead>Changed By</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {changes?.map((change) => (
            <TableRow key={change.id}>
              <TableCell>
                {format(new Date(change.created_at), "MMM d, yyyy HH:mm")}
              </TableCell>
              <TableCell className="capitalize">{change.change_type}</TableCell>
              <TableCell>{change.created_by}</TableCell>
              <TableCell>
                {Object.entries(change.changes).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeChangeHistory;