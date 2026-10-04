import "../../css/ManageBooksTable.css";
import { useEffect, useState } from "react";
import AddBookModal from "../../modals/AddBookModal";
import ImportBooksModal from "../../modals/ImportBooksModal";

function ManageBooksTable() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [editingBook, setEditingBook] = useState(null);
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

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

        <div className="manage-books">

            <div className="manage-books-header">

                <h2>Manage Books</h2>

                <input
                    type="text"
                    className="search-book-input"
                    placeholder="🔍 Search by title, author or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="manage-books-actions">

                    <button
                        className="add-book-btn"
                        onClick={() => setShowAddBookModal(true)}
                    >
                        + Add Book
                    </button>

                    <button
                        className="import-books-btn"
                        onClick={() => setShowImportModal(true)}
                    >
                        Import Books
                    </button>
                </div>
            </div>

            <table className="manage-books-table">
                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Cover</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        books
                            .filter((book) => {

                                if (search.trim() === "") return true;
                                return (
                                    book.title.toLowerCase().includes(search.toLowerCase()) ||
                                    book.author.toLowerCase().includes(search.toLowerCase()) ||
                                    book.category.toLowerCase().includes(search.toLowerCase())
                                );
                            })
                            .map((book) => (

                                <tr key={book.id}>
                                    <td>{book.id}</td>
                                    <td>

                                        {book.cover_id ? (
                                            <img
                                                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`}
                                                alt={book.title}
                                                width="50"
                                            />
                                        ) : (
                                            <span>No Cover</span>
                                        )}

                                    </td>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.category}</td>
                                    <td>{book.quantity}</td>
                                    <td>

                                        <button
                                            className="edit-btn"
                                            onClick={() => setEditingBook(book)}
                                        >
                                            ✏ Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteBook(book.id)}
                                        >
                                            🗑 Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                    }
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

            {showAddBookModal && (
                <AddBookModal
                    onClose={() => setShowAddBookModal(false)}
                    onBookAdded={loadBooks}
                />
            )}

            {showImportModal && (
                <ImportBooksModal
                    onClose={() => setShowImportModal(false)}
                    onBooksImported={loadBooks}
                />
            )}

        </div>
    );
}

export default ManageBooksTable;