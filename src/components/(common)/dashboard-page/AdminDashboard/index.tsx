import AdminStatisticsSection from "./AdminStatisticsSection";
import ChartAreaInteractiveSection from "./ChartAreaInteractiveSection";
import DataTableUserActivitiesSection from "./DataTableUserActivitiesSection";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <AdminStatisticsSection />
      <ChartAreaInteractiveSection />
      <DataTableUserActivitiesSection />
    </div>
  );
};

export default AdminDashboard;
