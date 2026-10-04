import "../css/AdminDashboard.css";
import { useEffect, useState } from "react";
import AdminSummaryCards from "../components/admin/AdminSummaryCards";
import BorrowedBooksTable from "../components/books/BorrowedBooksTable";
import ManageBooksTable from "../components/books/ManageBooksTable";

function AdminDashboard() {
    const [stats, setStats] = useState({
        total_books: 0,
        total_users: 0,
        borrowed_books: 0,
        overdue_books: 0
    });

    useEffect(() => {
        fetch("http://127.0.0.1:5000/dashboard-stats")
            .then((response) => response.json())
            .then((data) => {
                setStats(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div className="admin-page">
            <div className="admin-container">

                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back, Admin! Here's what's happening in your library.</p>
                </div>

                <AdminSummaryCards stats={stats} />
                <BorrowedBooksTable />
                <ManageBooksTable />
            </div>
        </div>
    );
}
export default AdminDashboard;