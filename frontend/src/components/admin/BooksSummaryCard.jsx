import "../../css/BooksSummaryCard.css";

function BooksSummaryCard({ totalBooks }) {
  return (
    <div className="books-summary-card">
      <p className="summary-title">Books available</p>
      <h2 className="summary-count">{totalBooks}</h2>
      <p className="summary-subtitle">Books currently available in the library</p>

    </div>
  );
}
export default BooksSummaryCard;