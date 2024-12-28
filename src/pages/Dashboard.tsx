import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

type TeamMember = {
  name: string;
  role: string;
  updates: string | null;
};

type ProjectSummary = {
  projectName: string;
  coordinators: TeamMember[];
  teamMembers: TeamMember[];
};

const LEADERSHIP_ROLES = ['Project Manager', 'Project Coordinator', 'Lead'];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const { data: projectSummaries, isLoading } = useQuery({
    queryKey: ["projectSummaries"],
    queryFn: async () => {
      const { data: employees } = await supabase
        .from("employees")
        .select("*")
        .not("project", "is", null);

      if (!employees) return [];

      const projectMap = new Map<string, ProjectSummary>();

      employees.forEach((employee) => {
        if (!employee.project) return;

        if (!projectMap.has(employee.project)) {
          projectMap.set(employee.project, {
            projectName: employee.project,
            coordinators: [],
            teamMembers: [],
          });
        }

        const project = projectMap.get(employee.project)!;
        const member = {
          name: employee.name,
          role: employee.role,
          updates: employee.updates,
        };

        if (LEADERSHIP_ROLES.includes(employee.role)) {
          project.coordinators.push(member);
        } else {
          project.teamMembers.push(member);
        }
      });

      return Array.from(projectMap.values());
    },
  });

  if (isLoading) {
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
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Coordinators</TableHead>
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
                      {project.coordinators.map((member, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-muted-foreground"> - {member.role}</span>
                        </div>
                      ))}
                    </div>
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
                    <div className="space-y-1">
                      {[...project.coordinators, ...project.teamMembers].map((member, index) => (
                        member.updates && (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{member.name}:</span>
                            <span className="text-muted-foreground"> {member.updates}</span>
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