import { useState } from "react";
import "../css/BorrowModal.css";

function AddBookModal({ onClose, onBookAdded }) {
    const [book, setBook] = useState({
        title: "",
        author: "",
        category: "Fiction",
        quantity: 1,
    });

    const handleAddBook = async () => {
        console.log("Add Book button clicked");
        const response = await fetch(
            "http://127.0.0.1:5000/books",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(book),
            }
        );

        if (response.ok) {
            alert("Book Added Successfully!");
            onBookAdded();
            onClose();
        } else {
            alert("Failed to add book.");
        }
    };

    return (

        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Book</h2>
                <label>Title</label>

                <input
                    type="text"
                    value={book.title}
                    onChange={(e) =>
                        setBook({
                            ...book,
                            title: e.target.value
                        })
                    }
                />

                <label>Author</label>

                <input
                    type="text"
                    value={book.author}
                    onChange={(e) =>
                        setBook({
                            ...book,
                            author: e.target.value
                        })
                    }
                />

                <label>Category</label>

                <select
                    value={book.category}
                    onChange={(e) =>
                        setBook({
                            ...book,
                            category: e.target.value
                        })
                    }
                >
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Biography</option>
                    <option>Children</option>
                    <option>Mystery & Thriller</option>
                    <option>Romance</option>
                </select>

                <label>Quantity</label>

                <input
                    type="number"
                    value={book.quantity}
                    onChange={(e) =>
                        setBook({
                            ...book,
                            quantity: Number(e.target.value)
                        })
                    }
                />

                <div className="modal-buttons">

                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button onClick={handleAddBook}>
                        Add Book
                    </button>
                </div>
            </div>
        </div>
    );
}
export default AddBookModal;