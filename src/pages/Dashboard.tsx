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
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type ProjectSummary = {
  projectName: string;
  teamMembers: Array<{
    name: string;
    role: string;
    updates: string | null;
  }>;
};

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

  const { data: projectSummaries, isLoading } = useQuery({
    queryKey: ["projectSummaries"],
    queryFn: async () => {
      const { data: employees, error } = await supabase
        .from("employees")
        .select("*")
        .not("project", "is", null);

      if (error) throw error;
      if (!employees) return [];

      const projectMap = new Map<string, ProjectSummary>();

      employees.forEach((employee) => {
        if (!employee.project) return;

        if (!projectMap.has(employee.project)) {
          projectMap.set(employee.project, {
            projectName: employee.project,
            teamMembers: [],
          });
        }

        const project = projectMap.get(employee.project)!;
        project.teamMembers.push({
          name: employee.name,
          role: employee.role,
          updates: employee.updates,
        });
      });

      return Array.from(projectMap.values());
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
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
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Team Members</TableHead>
                <TableHead>Current Updates</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectSummaries?.map((project) => (
                <TableRow key={project.projectName}>
                  <TableCell className="font-medium">
                    {project.projectName}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {project.teamMembers.map((member, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-muted-foreground"> - {member.role}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {project.teamMembers.map((member, index) => (
                        member.updates && (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{member.name}:</span>
                            <span className="text-muted-foreground ml-2">{member.updates}</span>
                          </div>
                        )
                      ))}
                    </div>
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