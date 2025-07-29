import AdminCardsSection from "./AdminCardsSection";
import ChartAreaInteractiveSection from "./ChartAreaInteractiveSection";
import DataTableUserActivitiesSection from "./DataTableUserActivitiesSection";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <AdminCardsSection />
      <ChartAreaInteractiveSection />
      <DataTableUserActivitiesSection />
    </div>
  );
};

export default AdminDashboard;
