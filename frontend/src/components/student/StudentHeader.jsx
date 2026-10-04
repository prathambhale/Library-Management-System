function StudentHeader({ user }) {

    return (
        <div className="student-header">
            <h1>📚 Student Dashboard</h1>
            <h2>Welcome, {user?.name} 👋</h2>
        </div>
    );
}

export default StudentHeader;