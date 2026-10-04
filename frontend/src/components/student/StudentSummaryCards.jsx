function StudentSummaryCards({
    borrowed,
    returned,
    dueSoon,
    overdue
}) {

    return (
        <div className="summary-container">

            <div className="summary-card">
    <h3>Borrowed</h3>
    <p>{borrowed}</p>
</div>

            <div className="summary-card">
    <h3>Returned</h3>
    <p>{returned}</p>
</div>

            <div className="summary-card">
    <h3>Due Soon</h3>
    <p>{dueSoon}</p>
</div>

            <div className="summary-card">
    <h3>Overdue</h3>
    <p>{overdue}</p>
</div>
        </div>
    );
}
export default StudentSummaryCards;