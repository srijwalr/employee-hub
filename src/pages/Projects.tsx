import { Layout } from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const Projects = () => {
  // Mock data - in a real app, this would come from an API
  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      status: "In Progress",
      team: ["John Doe", "Sarah Wilson"],
      deadline: "2024-06-30",
    },
    {
      id: 2,
      name: "CRM System",
      status: "Planning",
      team: ["Jane Smith", "Tom Brown"],
      deadline: "2024-08-15",
    },
    {
      id: 3,
      name: "Mobile App",
      status: "In Progress",
      team: ["Mike Johnson", "Lisa Anderson"],
      deadline: "2024-07-20",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Projects</h1>
        
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Team Members</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.team.join(", ")}</TableCell>
                  <TableCell>{project.deadline}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default Projects;