import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLibrary } from "../LibraryContext.jsx";

export default function Login() {
  const { login } = useLibrary();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to the Digital Library Management System</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <button type="submit" className="btn btn-primary btn-block">
          Log In
        </button>

        <div className="auth-hint">
          <strong>Demo accounts:</strong>
          <div>Admin — admin@library.com / admin123</div>
          <div>Member — member@library.com / member123</div>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
