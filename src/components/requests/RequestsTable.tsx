import { useState } from "react";
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, X } from "lucide-react";
import { subDays } from "date-fns";
import ProjectFilter from "@/components/employees/ProjectFilter";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      // Calculate date 7 days ago
      const oneWeekAgo = subDays(new Date(), 7).toISOString();

      const { data, error } = await supabase
        .from("resource_requests")
        .select(`
          *,
          project:projects(name)
        `)
        .or(`status.neq.Approved,and(status.eq.Approved,created_at.gt.${oneWeekAgo})`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Request[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("resource_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast({
        title: "Success",
        description: "Request status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update request status: " + error.message,
      });
    },
  });

  if (isLoading) {
    return <div>Loading requests...</div>;
  }

  if (!requests?.length) {
    return <div>No resource requests found.</div>;
  }

  const uniqueProjects = Array.from(
    new Set(requests.map((request) => request.project?.name))
  )
    .filter(Boolean)
    .map((name) => ({ name: name as string }));

  const filteredRequests = selectedProject
    ? requests.filter((request) => request.project?.name === selectedProject)
    : requests;

  return (
    <div className="space-y-4">
      <ProjectFilter
        projects={uniqueProjects}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
      />
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
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
                <TableCell>
                  {request.status === "Pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100"
                        onClick={() =>
                          updateStatus.mutate({ id: request.id, status: "Approved" })
                        }
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-50 hover:bg-red-100"
                        onClick={() =>
                          updateStatus.mutate({ id: request.id, status: "Rejected" })
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default RequestsTable;