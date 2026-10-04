import "../../css/EmptyState.css";

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        📚
      </div>
      <h2>No Books Found</h2>
      <p>There are no books available in this category.</p>

    </div>
  );
}
export default EmptyState;