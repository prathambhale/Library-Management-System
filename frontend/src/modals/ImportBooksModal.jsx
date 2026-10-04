import { useState } from "react";

function ImportBooksModal({ onClose, onBooksImported }) {
    const [category, setCategory] = useState("Fiction");
    const handleImportBooks = async () => {

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/import-books/${category}`
            );

            const data = await response.json();
            alert(data.message);
            onBooksImported();
            onClose();

        } catch (error) {
            console.error(error);
            alert("Failed to import books.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Import Books</h2>
                <label>Select Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                <div className="modal-buttons">
                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button onClick={handleImportBooks}>
                        Import Books
                    </button>
                </div>
            </div>
        </div>
    );
}
export default ImportBooksModal;