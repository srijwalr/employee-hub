import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type ProjectAssignment = {
  project_id: string;
  allocation_percentage: number;
};

type EmployeeFormValues = {
  name: string;
  role: string;
  status: string;
  updates?: string;
};

interface AddEmployeeFormProps {
  onSuccess: () => void;
}

const AddEmployeeForm = ({ onSuccess }: AddEmployeeFormProps) => {
  const [projectAssignments, setProjectAssignments] = useState<ProjectAssignment[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<EmployeeFormValues>({
    defaultValues: {
      status: "Available"
    }
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddProject = () => {
    setProjectAssignments([
      ...projectAssignments,
      { project_id: "", allocation_percentage: 0 }
    ]);
  };

  const handleRemoveProject = (index: number) => {
    const newAssignments = [...projectAssignments];
    newAssignments.splice(index, 1);
    setProjectAssignments(newAssignments);
  };

  const handleProjectChange = (index: number, field: keyof ProjectAssignment, value: any) => {
    const newAssignments = [...projectAssignments];
    newAssignments[index] = { ...newAssignments[index], [field]: value };
    setProjectAssignments(newAssignments);
  };

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      // Insert employee
      const { data: employee, error: employeeError } = await supabase
        .from("employees")
        .insert([values])
        .select()
        .single();
      
      if (employeeError) throw employeeError;

      // Insert project assignments if any
      if (projectAssignments.length > 0) {
        const { error: projectsError } = await supabase
          .from("employee_projects")
          .insert(
            projectAssignments.map(assignment => ({
              employee_id: employee.id,
              ...assignment
            }))
          );
        
        if (projectsError) throw projectsError;
      }

      toast({
        title: "Success",
        description: "Employee added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["employees"] });
      form.reset();
      setProjectAssignments([]);
      onSuccess();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Frontend Developer">
                    Frontend Developer
                  </SelectItem>
                  <SelectItem value="Backend Developer">
                    Backend Developer
                  </SelectItem>
                  <SelectItem value="UI/UX Designer">
                    UI/UX Designer
                  </SelectItem>
                  <SelectItem value="Project Manager">
                    Project Manager
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Project Assignments</FormLabel>
          {projectAssignments.map((assignment, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select
                value={assignment.project_id}
                onValueChange={(value) =>
                  handleProjectChange(index, "project_id", value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="0"
                max="100"
                value={assignment.allocation_percentage}
                onChange={(e) =>
                  handleProjectChange(
                    index,
                    "allocation_percentage",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-20"
              />
              <span>%</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveProject(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddProject}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On bench">On bench</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="updates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Updates</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter any updates or notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Employee
        </Button>
      </form>
    </Form>
  );
};

export default AddEmployeeForm;