import { Layout } from "@/components/Layout";
import { ChangeHistoryList } from "@/components/history/ChangeHistoryList";

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <ChangeHistoryList />
      </div>
    </Layout>
  );
};

export default Dashboard;