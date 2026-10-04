import "../css/StudentDashboard.css";
import { useEffect, useState } from "react";
import StudentHeader from "../components/student/StudentHeader";
import StudentSummaryCards from "../components/student/StudentSummaryCards";
import BorrowedBooksGrid from "../components/student/BorrowedBooksGrid";
import BorrowHistoryTable from "../components/student/BorrowHistoryTable";

function StudentDashboard() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {

        fetch(`http://127.0.0.1:5000/student-books/${user.id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Books from API:", data);
                setBorrowedBooks(data);
                fetch(`http://127.0.0.1:5000/student-history/${user.id}`)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("History:", data);
                        setHistory(data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const borrowedCount = borrowedBooks.filter(
        (book) => book.status === "Borrowed"
    ).length;

    const dueSoonCount = borrowedBooks.filter(
        (book) => book.status === "Due Soon"
    ).length;

    const overdueCount = borrowedBooks.filter(
        (book) => book.status === "Overdue"
    ).length;

    const returnedCount = history.filter(
        (book) => book.status === "Returned"
    ).length;

    return (
        <div className="student-dashboard">
            {/* Header Section */}
            <StudentHeader user={user} />

            {/* Summary Cards */}
            <StudentSummaryCards
                borrowed={borrowedCount}
                returned={returnedCount}
                dueSoon={dueSoonCount}
                overdue={overdueCount}
            />

            {/* Search Bar */}
            <p>Total Books: {borrowedBooks.length}</p>

            {/* Current Books */}
            <div className="books-section">
                <h2>📚 Current Borrowed Books</h2>
                {borrowedBooks.length === 0 ? (
                    <div className="empty-box">
                        No borrowed books yet.
                    </div>
                ) : (
                    <BorrowedBooksGrid borrowedBooks={borrowedBooks} />
                )}
            </div>

            {/* Borrow History */}
            <BorrowHistoryTable />

        </div>
    );
}
export default StudentDashboard;