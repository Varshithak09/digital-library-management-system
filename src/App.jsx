import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LibraryProvider, useLibrary } from "./LibraryContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Catalog from "./components/Catalog.jsx";
import MyBooks from "./components/MyBooks.jsx";
import ManageBooks from "./components/ManageBooks.jsx";

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser } = useLibrary();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && currentUser.role !== "admin") return <Navigate to="/dashboard" replace />;
  return (
    <>
      <Navbar />
      <div className="content-wrap">{children}</div>
    </>
  );
}

function AppRoutes() {
  const { currentUser } = useLibrary();

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <Signup />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/catalog"
        element={
          <ProtectedRoute>
            <Catalog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-books"
        element={
          <ProtectedRoute>
            <MyBooks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage"
        element={
          <ProtectedRoute adminOnly>
            <ManageBooks />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LibraryProvider>
      <AppRoutes />
    </LibraryProvider>
  );
}
