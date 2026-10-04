function BorrowedBooksGrid({ borrowedBooks }) {

    return (
        <div className="borrowed-books-grid">
            {borrowedBooks.map((book) => (

                <div
                    className="borrowed-book-card"
                    key={book.id}
                >
                    <h3>{book.title}</h3>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Category:</strong> {book.category}</p>
                    <p><strong>Borrowed:</strong> {book.borrow_date}</p>
                    <p><strong>Due Date:</strong> {book.due_date}</p>

                    <span
                        className={`status ${book.status.toLowerCase().replace(" ", "-")}`}
                    >
                        {book.status}
                    </span>
                </div>
            ))}
        </div>
    );
}
export default BorrowedBooksGrid;