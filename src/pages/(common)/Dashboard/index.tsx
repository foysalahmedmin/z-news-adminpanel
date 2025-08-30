import AdminDashboard from "@/components/(common)/dashboard-page/AdminDashboard";
import PageHeader from "@/components/sections/PageHeader";

const Dashboard = () => {
  console.log(import.meta.env.VITE_API_URL as string);
  return (
    <main className="space-y-6">
      <PageHeader name="" />
      <section>
        <AdminDashboard />
      </section>
    </main>
  );
};

export default Dashboard;
