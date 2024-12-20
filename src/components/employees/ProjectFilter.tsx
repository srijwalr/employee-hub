import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectFilterProps {
  projects?: { name: string }[];
  selectedProject: string | null;
  onProjectChange: (value: string | null) => void;
}

const ProjectFilter = ({ projects, selectedProject, onProjectChange }: ProjectFilterProps) => {
  return (
    <div className="w-[200px]">
      <Select
        value={selectedProject || "all"}
        onValueChange={(value) => onProjectChange(value === "all" ? null : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects?.map((project) => (
            <SelectItem key={project.name} value={project.name}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectFilter;