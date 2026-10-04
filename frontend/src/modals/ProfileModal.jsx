import "../css/ProfileModal.css";
import { useNavigate } from "react-router-dom";

function ProfileModal({ user, onClose, onLogout }) {
    const navigate = useNavigate();

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>My Profile</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <div className="modal-buttons">

                    <button
                        onClick={() => {
                            onClose();
                            navigate("/student");
                        }}
                    >
                        My Dashboard
                    </button>

                    <button onClick={onLogout}>
                        Logout
                    </button>

                    <button onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;