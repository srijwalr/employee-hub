import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import EditableProjectRow from "./EditableProjectRow";

interface Project {
  id: string;
  name: string;
  code: string;
  status: string | null;
  allocation: number | null;
  updates: string | null;
  deadline: string | null;
}

const ProjectsTable = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Project>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
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

  const updateProject = useMutation({
    mutationFn: async (updates: Partial<Project> & { id: string }) => {
      const { error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", updates.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      setEditingId(null);
      setEditValues({});
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update project: " + error.message,
      });
    },
  });

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setEditValues(project);
  };

  const handleSave = async (id: string) => {
    updateProject.mutate({ id, ...editValues });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (!projects?.length) {
    return <div>No projects found. Add your first project to get started.</div>;
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Allocation (%)</TableHead>
            <TableHead>Updates</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              {editingId === project.id ? (
                <EditableProjectRow
                  project={project}
                  editValues={editValues}
                  onEditValuesChange={setEditValues}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.code}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.allocation || "—"}%</TableCell>
                  <TableCell>{project.updates || "—"}</TableCell>
                  <TableCell>
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "No deadline"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ProjectsTable;