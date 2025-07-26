import { ChartAreaInteractive } from "./ChartAreaInteractive";
import { SectionCards } from "./SectionCards";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <SectionCards />
      <ChartAreaInteractive />
    </div>
  );
};

export default AdminDashboard;
