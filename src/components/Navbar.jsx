import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLibrary } from "../LibraryContext.jsx";

export default function Navbar() {
  const { currentUser, logout } = useLibrary();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">📚 Digital Library</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/my-books">My Books</Link>
        {currentUser?.role === "admin" && <Link to="/manage">Manage Books</Link>}
      </div>
      <div className="navbar-user">
        <span className="navbar-username">
          {currentUser?.name} <span className="role-badge">{currentUser?.role}</span>
        </span>
        <button className="btn btn-secondary btn-small" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
