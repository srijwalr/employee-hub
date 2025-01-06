import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import AddEmployeeForm from "@/components/employees/AddEmployeeForm";
import EmployeesTable from "@/components/employees/EmployeesTable";
import FreeResourcesTable from "@/components/employees/FreeResourcesTable";
import { AddRoleForm } from "@/components/roles/AddRoleForm";
import { FilteredChangeHistory } from "@/components/history/FilteredChangeHistory";

const Employees = () => {
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Employees</h1>
          <div className="space-x-4">
            <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <AddEmployeeForm onSuccess={() => setIsEmployeeDialogOpen(false)} />
              </DialogContent>
            </Dialog>
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Role</DialogTitle>
                </DialogHeader>
                <AddRoleForm onSuccess={() => setIsRoleDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <Tabs defaultValue="employees" className="p-4">
              <TabsList>
                <TabsTrigger value="employees">Employees</TabsTrigger>
                <TabsTrigger value="free-resources">Free Resources</TabsTrigger>
              </TabsList>
              <TabsContent value="employees">
                <EmployeesTable />
              </TabsContent>
              <TabsContent value="free-resources">
                <FreeResourcesTable />
              </TabsContent>
            </Tabs>
          </Card>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Change History</h2>
            <FilteredChangeHistory tableName="employees" />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Employees;