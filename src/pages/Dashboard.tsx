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

type ProjectSummary = {
  projectName: string;
  teamMembers: Array<{
    name: string;
    role: string;
    updates: string | null;
  }>;
};

const Dashboard = () => {
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
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
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
                    <div className="space-y-1">
                      {project.teamMembers.map((member, index) => (
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