import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
import { useQuery } from "@tanstack/react-query";

interface Employee {
  id: string;
  name: string;
  role: string;
  project: string | null;
  updates: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Employee[];
    },
  });

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Group employees by project
  const projectGroups = employees?.reduce((groups: Record<string, Employee[]>, employee) => {
    const project = employee.project || "Unassigned";
    if (!groups[project]) {
      groups[project] = [];
    }
    groups[project].push(employee);
    return groups;
  }, {});

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-foreground">Project Summary</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Current Update</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(projectGroups || {}).map(([project, employees]) => (
                employees.map((employee, index) => (
                  <TableRow key={employee.id}>
                    {index === 0 && (
                      <TableCell rowSpan={employees.length} className="align-top">
                        {project === "Unassigned" ? "—" : project}
                      </TableCell>
                    )}
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.updates || "—"}</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;