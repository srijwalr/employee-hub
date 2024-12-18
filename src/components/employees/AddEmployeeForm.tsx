import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EmployeeFormValues = {
  name: string;
  role: string;
  project?: string;
};

interface AddEmployeeFormProps {
  onSuccess: () => void;
}

const AddEmployeeForm = ({ onSuccess }: AddEmployeeFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<EmployeeFormValues>();

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      const { error } = await supabase.from("employees").insert([values]);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Employee added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["employees"] });
      form.reset();
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
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Project name" {...field} />
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