import "../../css/Header.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle } from "react-icons/fa";

function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const [showBooksMenu, setShowBooksMenu] = useState(false);
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    return (
        <header className="header">

            <div
                className="menu-icon"
                onClick={() => setShowMenu(!showMenu)}
            >
                <FaBars />
            </div>

            <div className="profile">
                {showMenu && (
                    <div className="dropdown-menu">
                        <div
                            className="dropdown-item"
                            onClick={() => {
                                navigate("/dashboard");
                                setShowMenu(false);
                            }}
                        >
                            🏠 Dashboard
                        </div>

                        <div
                            className="dropdown-item"
                            onClick={() => setShowBooksMenu(!showBooksMenu)}
                        >
                            📚 Books ▶
                        </div>

                        {showBooksMenu && (
                            <div className="submenu">
                                <div className="submenu-item" onClick={() => navigate("/genre/Fiction")}>
                                    📖 Fiction
                                </div>

                                <div className="submenu-item" onClick={() => navigate("/genre/Non-Fiction")}>
                                    📚 Non-Fiction
                                </div>

                                <div className="submenu-item" onClick={() => navigate("/genre/Science")}>
                                    🧪 Science
                                </div>

                                <div className="submenu-item" onClick={() => navigate("/genre/History")}>
                                    📜 History
                                </div>

                                <div className="submenu-item" onClick={() => navigate("/genre/Biography")}>
                                    👤 Biography
                                </div>

                                <div className="submenu-item" onClick={() => navigate("/genre/Children")}>
                                    🧒🏻 Children
                                </div>

                                <div className="submenu-item" onClick={() => navigate("/genre/Mystery & Thriller")}>
                                    🔎 Mystery & Thriller
                                </div>

                                <div className="submenu-item" onClick={() => navigate("/genre/Romance")}>
                                    ❤️ Romance
                                </div>

                            </div>
                        )}

                        <div
                            className="dropdown-item"
                            onClick={() => {
                                navigate("/student");
                                setShowMenu(false);
                            }}
                        >
                            🪪 My Dashboard
                        </div>

                        <div
                            className="dropdown-item"
                            onClick={() => {
                                localStorage.removeItem("loggedInUser");
                                navigate("/");
                            }}
                        >
                            🚪 Logout
                        </div>
                    </div>
                )}
                <FaUserCircle className="profile-icon" />
                <span>{user?.name}</span>
            </div>
        </header>
    );
}
export default Header;