import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GenreBooks from "./pages/GenreBooks";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/admin" element={<ProtectedAdminRoute> <AdminDashboard /> </ProtectedAdminRoute>} />
        <Route path="/genre/:category" element={<GenreBooks />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;