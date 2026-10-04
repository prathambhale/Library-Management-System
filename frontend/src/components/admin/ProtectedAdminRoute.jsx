import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
    const user = JSON.parse(
        localStorage.getItem("loggedInUser")
    );
    if (!user) {
        return <Navigate to="/dashboard" replace />;
    }
    if (user.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}
export default ProtectedAdminRoute;