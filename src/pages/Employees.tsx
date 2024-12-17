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

const Employees = () => {
  // Mock data - in a real app, this would come from an API
  const employees = [
    {
      id: 1,
      name: "John Doe",
      role: "Frontend Developer",
      project: "E-commerce Platform",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Backend Developer",
      project: "CRM System",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "UI/UX Designer",
      project: "Mobile App",
      status: "Active",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Employees</h1>
        
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Project</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.project}</TableCell>
                  <TableCell>{employee.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default Employees;