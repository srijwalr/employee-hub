import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ProjectTeam = () => {
  const { projectCode } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("code", projectCode)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: teamMembers, isLoading: membersLoading } = useQuery({
    queryKey: ["team-members", projectCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("project", projectCode);

      if (error) throw error;
      return data;
    },
  });

  if (projectLoading || membersLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">
              Team Members - {project?.name || projectCode}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{project?.status || "No status"}</Badge>
              {project?.allocation && (
                <Badge variant="outline">
                  Allocation: {project.allocation}%
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updates</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.status || "No status"}</Badge>
                    </TableCell>
                    <TableCell>{member.updates || "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No team members assigned to this project
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default ProjectTeam;