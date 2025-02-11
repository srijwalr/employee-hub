
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

type ProjectSummary = {
  projectName: string;
  coordinators: Array<{
    name: string;
    role: string;
    updates: string | null;
  }>;
  teamMembers: Array<{
    name: string;
    role: string;
    updates: string | null;
  }>;
};

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
      // Get employees with their project assignments and roles
      const { data: employees, error } = await supabase
        .from("employees")
        .select(`
          *,
          employee_projects:employee_projects(
            project:projects(name)
          )
        `);

      if (error) throw error;
      if (!employees) return [];

      // Get roles to identify coordinators
      const { data: roles } = await supabase
        .from("roles")
        .select("name, type");

      if (!roles) return [];

      // Create a map of role names to their types
      const roleTypes = new Map(roles.map(role => [role.name, role.type]));

      const projectMap = new Map<string, ProjectSummary>();

      employees.forEach((employee) => {
        employee.employee_projects?.forEach((ep) => {
          const projectName = ep.project?.name;
          if (!projectName) return;

          if (!projectMap.has(projectName)) {
            projectMap.set(projectName, {
              projectName,
              coordinators: [],
              teamMembers: [],
            });
          }

          const project = projectMap.get(projectName)!;
          const memberInfo = {
            name: employee.name,
            role: employee.role,
            updates: employee.updates,
          };

          const roleType = roleTypes.get(employee.role);
          if (roleType === 'coordinator') {
            project.coordinators.push(memberInfo);
          } else {
            project.teamMembers.push(memberInfo);
          }
        });
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
