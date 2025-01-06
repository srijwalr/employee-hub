import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddProjectForm from "@/components/projects/AddProjectForm";
import ProjectsTable from "@/components/projects/ProjectsTable";
import { FilteredChangeHistory } from "@/components/history/FilteredChangeHistory";

const Projects = () => {
  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-foreground">Projects</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <AddProjectForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <ProjectsTable />
          </Card>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Change History</h2>
            <FilteredChangeHistory tableName="projects" />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Projects;