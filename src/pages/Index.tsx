import { Card } from "@/components/ui/card";
import { Layout } from "@/components/Layout";

const Dashboard = () => {
  const stats = [
    { label: "Total Employees", value: "124" },
    { label: "Active Projects", value: "12" },
    { label: "Unassigned", value: "5" },
    { label: "Project Completion", value: "87%" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 card-hover">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
              <p className="text-3xl font-bold text-primary mt-2">{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Project Status</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">No active projects</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;