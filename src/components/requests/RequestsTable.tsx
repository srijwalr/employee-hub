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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Request {
  id: string;
  project_id: string;
  requested_by: string;
  role: string;
  quantity: number;
  status: string;
  notes: string | null;
  created_at: string;
  project: {
    name: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const RequestsTable = () => {
  const { data: requests, isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resource_requests")
        .select(`
          *,
          project:projects(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Request[];
    },
  });

  if (isLoading) {
    return <div>Loading requests...</div>;
  }

  if (!requests?.length) {
    return <div>No resource requests found.</div>;
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                {request.project?.name || "Unknown Project"}
              </TableCell>
              <TableCell>{request.role}</TableCell>
              <TableCell>{request.quantity}</TableCell>
              <TableCell>{request.requested_by}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>{request.notes || "—"}</TableCell>
              <TableCell>
                {new Date(request.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RequestsTable;