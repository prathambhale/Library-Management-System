import "../css/AuthModal.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthModal({ onClose, onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleLogin = () => {
        fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    localStorage.setItem(
                        "loggedInUser",
                        JSON.stringify(data.user)
                    );
                    onLogin(data.user);
                    alert("Login Successful!");
                    if (data.user.role === "admin") {
                        navigate("/admin");
                    } else {
                        navigate("/dashboard");
                    }
                    onClose();
                }
                else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleRegister = () => {
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })

        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert(data.message);
                    setIsLogin(true);
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });

    };
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{isLogin ? "Login" : "Create Account"}</h2>
                {!isLogin && (
                    <>
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </>
                )}
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {!isLogin && (
                    <>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </>
                )}
                <div className="modal-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={isLogin ? handleLogin : handleRegister}>
                        {isLogin ? "Login" : "Register"}
                    </button>
                </div>
                <div className="auth-switch">
                    {isLogin ? (
                        <p>
                            Don't have an account?{" "}
                            <span onClick={() => setIsLogin(false)}>Register</span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <span onClick={() => setIsLogin(true)}>Login</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
export default AuthModal;