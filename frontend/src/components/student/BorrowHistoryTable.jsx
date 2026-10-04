import { useEffect, useState } from "react";
import "../../css/BorrowHistoryTable.css";

function BorrowHistoryTable() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/student-history/${user.id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("History:", data);
                setHistory(data);
            })
            .catch((error) => {
                console.error("Error fetching history:", error);
            });
    }, []);

    const filteredHistory = history.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (

        <div className="books-section">
            <h2>📖 Borrow History</h2>
            <div className="history-search">

                <input
                    type="text"
                    placeholder="Search your borrow history..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>

            <div className="history-table-container">
                <table className="history-table">

                    <thead>
                        <tr>
                            <th>Book</th>
                            <th>Borrow Date</th>
                            <th>Return Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredHistory.map((book) => (
                            <tr key={book.id}>
                                <td>{book.title}</td>
                                <td>{book.borrow_date}</td>
                                <td>{book.return_date || "Not Returned"}</td>

                                <td>
                                    <span className={`history-status ${book.status.toLowerCase().replace(" ", "-")}`}>
                                        {book.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default BorrowHistoryTable;