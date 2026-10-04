function StudentSearch({
    searchTerm,
    setSearchTerm
}) {

    return (
        <div className="search-section">
            <input
    type="text"
    placeholder="Search your books..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
/>
        </div>
    );
}
export default StudentSearch;