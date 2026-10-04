import "../../css/DashboardHeader.css";
import { PiBooksLight } from "react-icons/pi";

function DashboardHeader() {
  return (
    <div className="dashboard-header">
      <PiBooksLight className="dashboard-icon" />
      <h1 className="dashboard-title">Library management system</h1>
    </div>
  );
}
export default DashboardHeader;