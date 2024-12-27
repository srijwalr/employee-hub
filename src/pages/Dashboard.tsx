import { Layout } from "@/components/Layout";
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
import { Button } from "@/components/ui/button";
import { LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  name: string;
  code: string;
  status: string | null;
  allocation: number | null;
  deadline: string | null;
}

interface Employee {
  id: string;
  name: string;
  project: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again.",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/login");
    }
  };

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("id, name, project");

      if (error) throw error;
      return data as Employee[];
    },
  });

  const getProjectMembers = (projectCode: string) => {
    if (!employees) return [];
    return employees.filter(emp => emp.project === projectCode);
  };

  if (projectsLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
          <p>Loading project summaries...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Team Members</TableHead>
                <TableHead>Allocation (%)</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.code}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{project.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-wrap gap-1">
                        {getProjectMembers(project.code).slice(0, 2).map((member) => (
                          <Badge key={member.id} variant="outline">
                            {member.name}
                          </Badge>
                        ))}
                        {getProjectMembers(project.code).length > 2 && (
                          <Badge variant="outline">
                            +{getProjectMembers(project.code).length - 2}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/projects/${project.code}/team`)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{project.allocation || "—"}%</TableCell>
                  <TableCell>
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "No deadline"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;