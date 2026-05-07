import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 LOGIN SEDERHANA (HARDCODE)
    if (username === "almira" && password === "5584") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;