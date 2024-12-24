import { Users, Briefcase, LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Employees", icon: Users, path: "/employees" },
  { title: "Projects", icon: Briefcase, path: "/projects" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link to="/" className="block px-4 py-6 border-b border-sidebar-border">
              <img 
                src="/lovable-uploads/048c5963-c784-4582-9199-9ff4d8939840.png" 
                alt="Tegain Logo" 
                className="h-8 w-auto transition-all duration-300 hover:opacity-80"
              />
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-200 hover:bg-sidebar-accent rounded-md group"
                    >
                      <item.icon className="h-4 w-4 text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground" />
                      <span className="text-sidebar-foreground/90 group-hover:text-sidebar-accent-foreground">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}