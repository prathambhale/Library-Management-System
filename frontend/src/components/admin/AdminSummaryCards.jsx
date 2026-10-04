import "../../css/AdminSummaryCards.css";
import {
    PiBooks,
    PiUsers,
    PiBookOpen,
    PiWarningCircle
} from "react-icons/pi";

function AdminSummaryCards({ stats }) {

    return (
        <div className="summary-cards">
            <div className="summary-card">
                <div className="card-icon">
                    <PiBooks />
                </div>
                <h2>{stats.total_books}</h2>
                <p>Total Books</p>
            </div>

            <div className="summary-card">
                <div className="card-icon">
                    <PiUsers />
                </div>
                <h2>{stats.total_users}</h2>    
                <p>Total Users</p>
            </div>

            <div className="summary-card">
                <div className="card-icon">
                    <PiBookOpen />
                </div>
                <h2>{stats.borrowed_books}</h2>
                <p>Borrowed Books</p>
            </div>

            <div className="summary-card">
                <div className="card-icon">
                    <PiWarningCircle />
                </div>
                <h2>{stats.overdue_books}</h2>
                <p>Overdue Books</p>
            </div>
        </div>
    );
}

export default AdminSummaryCards;