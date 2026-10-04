import "../css/GenreBooks.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookRow from "../components/books/BookRow";
import Layout from "../components/common/Layout";
import EmptyState from "../components/common/EmptyState";
import BorrowModal from "../modals/BorrowModal";

function GenreBooks() {
  const { category } = useParams();
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [borrowBook, setBorrowBook] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/books/${category}`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, [category]);

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Layout>
      <div className="genre-page">
        <Link
          to="/dashboard"
          className="back-button"
        >
          ← Back to Dashboard
        </Link>
        <h1>{category} Books</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search books by title or author..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="books-container">

          <div className="table-header">
            <div>Book</div>
            <div>Available</div>
            <div>By Whom</div>
            <div>Take Book</div>
          </div>

          {filteredBooks.length === 0 ? (
            <EmptyState />
          ) : (

            filteredBooks.map((book) => (

              <BookRow
                key={book.id}
                cover={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                title={book.title}
                author={book.author}
                available={book.quantity}
                borrowedBy="-"
                buttonText={
                  book.quantity === 0
                    ? "Currently Unavailable"
                    : "Borrow"
                }
                disabled={book.quantity === 0}
                onBorrow={() => setBorrowBook(book)}
              />
            ))
          )}

          <div className="table-footer">
            Total {category} Books : {filteredBooks.length}
          </div>
        </div>
      </div>

      {borrowBook && (
        <BorrowModal
          book={borrowBook}
          user={JSON.parse(localStorage.getItem("loggedInUser"))}
          onClose={() => setBorrowBook(null)}
        />
      )}
    </Layout>
  );
}
export default GenreBooks;