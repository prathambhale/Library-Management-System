import "../../css/BookRow.css";
import defaultBook from "../../assets/images/default-book.png";

function BookRow({
  cover,
  title,
  author,
  available,
  borrowedBy,
  buttonText,
  disabled,
  onBorrow,
}) {
  return (
    <div className="book-row">
      <div className="book-column book-info">
        <img
          src={cover || defaultBook}
          alt={title}
          className="book-cover"
          onError={(e) => {
            e.target.src = defaultBook;
          }}
        />

        <div>
          <h3>{title}</h3>
          <p>{author}</p>
        </div>
      </div>

      <div className="book-column">
        <span
          className={
            available > 0
              ? "available"
              : "not-available"
          }
        >
          {available}
        </span>
      </div>

      <div className="book-column">
        {borrowedBy}
      </div>
      <div className="book-column">

        <button
          onClick={onBorrow}
          disabled={disabled}
          className="take-book-btn"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default BookRow;