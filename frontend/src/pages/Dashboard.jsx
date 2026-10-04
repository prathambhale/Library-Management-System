import "../css/Dashboard.css";
import DashboardHeader from "../components/common/DashboardHeader";
import BooksSummaryCard from "../components/admin/BooksSummaryCard";
import GenreCard from "../components/books/GenreCard";
import { useEffect, useState } from "react";
import LoginModal from "../modals/AuthModal";
import ProfileModal from "../modals/ProfileModal";
import { useNavigate } from "react-router-dom";
import {PiBookOpen,PiBooks,PiFlask,PiScroll,PiUser,PiStar,PiMagnifyingGlass,PiHeart,PiClock,PiLock,} from "react-icons/pi";
import BottomCard from "../components/common/BottomCard";

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_books: 0,
        total_users: 0,
        borrowed_books: 0,
        overdue_books: 0,
        categories: {}
    });

    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {

        fetch("http://127.0.0.1:5000/dashboard-stats")
            .then((response) => response.json())
            .then((data) => {
                setStats(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        const user = localStorage.getItem("loggedInUser");

        if (user) {
            setLoggedInUser(JSON.parse(user));
        }
    }, []);

    const genres = [
        {
            icon: <PiBookOpen />,
            count: stats.categories["Fiction"] || 0,
            genre: "Fiction",
        },
        {
            icon: <PiBooks />,
            count: stats.categories["Non-Fiction"] || 0,
            genre: "Non-Fiction",
        },
        {
            icon: <PiFlask />,
            count: stats.categories["Science"] || 0,
            genre: "Science",
        },
        {
            icon: <PiScroll />,
            count: stats.categories["History"] || 0,
            genre: "History",
        },
        {
            icon: <PiUser />,
            count: stats.categories["Biography"] || 0,
            genre: "Biography",
        },
        {
            icon: <PiStar />,
            count: stats.categories["Children"] || 0,
            genre: "Children",
        },
        {
            icon: <PiMagnifyingGlass />,
            count: stats.categories["Mystery & Thriller"] || 0,
            genre: "Mystery & Thriller",
        },
        {
            icon: <PiHeart />,
            count: stats.categories["Romance"] || 0,
            genre: "Romance",
        }
    ];

    const [showLogin, setShowLogin] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const logout = () => {
        localStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
        alert("Logged out successfully!");
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <DashboardHeader />
                <BooksSummaryCard
                    totalBooks={stats.total_books}
                />

                <h3 className="section-title">By genre</h3>

                <div className="genre-grid">
                    {genres.map((item) => (
                        <GenreCard
                            key={item.genre}
                            icon={item.icon}
                            count={item.count}
                            genre={item.genre}
                        />
                    ))}
                </div>
                <div className="user-section">

                    <BottomCard
                        icon={<PiUser />}
                        title={loggedInUser ? loggedInUser.name : "User"}
                        subtitle={loggedInUser ? loggedInUser.role : "Not Logged In"}
                        arrow={true}
                        onClick={() => {

                            if (!loggedInUser) {
                                setShowLogin(true);
                            } else {
                                setShowProfile(true);
                            }
                        }}
                    />
                </div>

                <div className="bottom-grid">
                    <BottomCard
                        icon={<PiClock />}
                        title="Books Taken"
                        value={stats.books_taken}
                        subtitle="Total books borrowed"
                    />

                    <div
                        onClick={() => {
                            if (!loggedInUser) {
                                setShowLogin(true);
                            } else if (loggedInUser.role === "admin") {
                                window.location.href = "/admin";
                            } else {
                                alert("Only administrators can access the Admin Panel.");
                            }
                        }}
                    >

                        <BottomCard
                            icon={<PiLock />}
                            title="Admin Panel"
                            arrow={true}
                        />
                    </div>
                </div>

                {showProfile && (
                    <ProfileModal
                        user={loggedInUser}
                        onClose={() => setShowProfile(false)}
                        onLogout={() => {
                            logout();
                            setShowProfile(false);
                        }}
                    />
                )}

                {showLogin && (
                    <LoginModal
                        onClose={() => setShowLogin(false)}
                        onLogin={(user) => setLoggedInUser(user)}
                    />
                )}
            </div>
        </div>
    );
}
export default Dashboard;