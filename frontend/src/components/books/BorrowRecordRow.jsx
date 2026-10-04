import "../../css/BorrowRecordRow.css";

function BorrowRecordRow({
    borrowId,
    student,
    book,
    borrowDate,
    dueDate,
    status,
    action,
    fetchBorrowedBooks
}) {
    async function handleReturn() {
        const response = await fetch(
            `http://127.0.0.1:5000/return-book/${borrowId}`,
            {
                method: "PUT"
            }
        );
        const data = await response.json();
        alert(data.message);
        fetchBorrowedBooks();
    }

    async function handleNotify() {
        alert(`Reminder sent to ${student}`);
    }

    return (

        <tr>
            <td>{student}</td>
            <td>{book}</td>
            <td>{borrowDate}</td>
            <td>{dueDate}</td>

            <td>
                <span className={`status ${status.toLowerCase().replace(" ", "-")}`}>
                    {status}
                </span>
            </td>

            <td>

                {(status === "Borrowed" || status === "Due Soon") && (

                    <div className="action-buttons">
                        <button
                            className="return-btn"
                            onClick={handleReturn}
                        >
                            Return
                        </button>
                    </div>
                )}

                {status === "Overdue" && (

                    <div className="action-buttons">
                        <button
                            className="return-btn"
                            onClick={handleReturn}
                        >
                            Return
                        </button>

                        <button
                            className="notify-btn"
                            onClick={handleNotify}
                        >
                            Notify
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}

export default BorrowRecordRow;