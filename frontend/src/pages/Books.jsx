import "../css/Books.css";
import { useEffect, useState } from "react";

function Books() {
    const [books, setBooks] = useState([]);
    const [editingBook, setEditingBook] = useState(null);

    console.log("editingBook:", editingBook);

    const loadBooks = () => {
        fetch("http://127.0.0.1:5000/books")
            .then((response) => response.json())
            .then((data) => {
                setBooks(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const saveBook = () => {

        fetch(`http://127.0.0.1:5000/books/${editingBook.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editingBook)
        })
            .then((response) => response.json())
            .then(() => {
                loadBooks();
                setEditingBook(null);
                alert("Book Updated Successfully");

            })
            .catch((error) => {
                console.error(error);
            });
    };

    const deleteBook = (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmDelete) return;
        fetch(`http://127.0.0.1:5000/books/${id}`, {
            method: "DELETE"
        })
            .then((response) => response.json())
            .then(() => {
                loadBooks();
                alert("Book Deleted Successfully");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>Library Books</h1>
            <table
                border="1"
                cellPadding="10"
                style={{
                    borderCollapse: "collapse",
                    width: "100%"
                }}
            >

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cover</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>

                                <img
                                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`}
                                    alt={book.title}
                                    width="50"
                                />

                            </td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>{book.quantity}</td>
                            <td>
                                <button
                                    onClick={() => setEditingBook(book)}
                                >
                                    Edit
                                </button>
                                {" "}
                                <button
                                    onClick={() => deleteBook(book.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingBook && (

                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Book</h2>
                        <label>Title</label>
                        <input
                            type="text"
                            value={editingBook.title}
                            onChange={(e) =>
                                setEditingBook({
                                    ...editingBook,
                                    title: e.target.value
                                })
                            }
                        />

                        <label>Author</label>

                        <input
                            type="text"
                            value={editingBook.author}
                            onChange={(e) =>
                                setEditingBook({
                                    ...editingBook,
                                    author: e.target.value
                                })
                            }
                        />

                        <label>Category</label>

                        <select
                            value={editingBook.category}
                            onChange={(e) =>
                                setEditingBook({
                                    ...editingBook,
                                    category: e.target.value
                                })
                            }
                        >

                            <option>Fiction</option>
                            <option>Non Fiction</option>
                            <option>Science</option>
                            <option>History</option>
                            <option>Biography</option>
                            <option>Children</option>
                            <option>Mystery and Thriller</option>
                            <option>Romance</option>

                        </select>

                        <label>Quantity</label>

                        <input
                            type="number"
                            value={editingBook.quantity}
                            onChange={(e) =>
                                setEditingBook({
                                    ...editingBook,
                                    quantity: Number(e.target.value)
                                })
                            }
                        />

                        <div className="modal-buttons">

                            <button
                                onClick={() => setEditingBook(null)}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveBook}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Books;