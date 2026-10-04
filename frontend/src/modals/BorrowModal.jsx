import { useState } from "react";
import "../css/BorrowModal.css";

function BorrowModal({ book, user, onClose }) {
    const [dueDate, setDueDate] = useState("");
    const handleBorrow = async () => {
        const today = new Date().toISOString().split("T")[0];
        if (!dueDate) {
            alert("Please select a due date.");
            return;
        }
        if (dueDate < today) {
            alert("Due date cannot be in the past.");
            return;
        }
        const response = await fetch(
            "http://127.0.0.1:5000/borrow-book",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    book_id: book.id,
                    user_id: user.id,
                    borrow_date: new Date().toISOString().split("T")[0],
                    due_date: dueDate,
                }),
            }
        );
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            onClose();
            window.location.reload();
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Borrow Book</h2>
                <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                    alt={book.title}
                    width="120"
                />
                <p><strong>Title:</strong> {book.title}</p>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Category:</strong> {book.category}</p>
                <p><strong>Available:</strong> {book.quantity}</p>
                <label>Borrower Name</label>
                
                <input
                    type="text"
                    value={user?.name || ""}
                    readOnly
                />

                <label>Borrower Email</label>

                <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                />

                <label>Due Date</label>

                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                />

                <div className="modal-buttons">

                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button onClick={handleBorrow}>
                        Borrow Book
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BorrowModal;