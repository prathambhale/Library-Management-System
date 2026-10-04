import { useEffect, useState } from "react";
import "../../css/BorrowedBooksTable.css";
import BorrowRecordRow from "./BorrowRecordRow";

function BorrowedBooksTable() {
    const [borrowRecords, setBorrowRecords] = useState([]);
    const fetchBorrowedBooks = () => {
        
    fetch("http://127.0.0.1:5000/borrowed-books")
        .then((response) => response.json())
        .then((data) => {
            setBorrowRecords(data);
        })
        .catch((error) => {
            console.error("Error fetching borrowed books:", error);
        });
};

useEffect(() => {
    fetchBorrowedBooks();
}, []);

    return (

        <div className="borrow-table-card">

            <div className="borrow-table-header">
                <h2>Borrowed Books & Due Dates</h2>
            </div>

            <table className="borrow-table">

                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Book</th>
                        <th>Borrow Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

               <tbody>
    {
        borrowRecords.map((record) => (

            <BorrowRecordRow
    key={record.id}
    borrowId={record.id}
    student={record.student}
    book={record.book}
    borrowDate={record.borrow_date}
    dueDate={record.due_date}
    status={record.status}
    action={record.status === "Overdue" ? "Notify" : "Return"}
    fetchBorrowedBooks={fetchBorrowedBooks}
/>
        ))
    }
</tbody>
            </table>
        </div>
    );
}

export default BorrowedBooksTable;