import React from "react";
import { useLibrary } from "../LibraryContext.jsx";

export default function Dashboard() {
  const { books, records, currentUser, users } = useLibrary();

  const totalBooks = books.reduce((sum, b) => sum + Number(b.copies), 0);
  const totalAvailable = books.reduce((sum, b) => sum + Number(b.available), 0);
  const totalBorrowed = totalBooks - totalAvailable;
  const activeBorrows = records.filter((r) => r.status === "borrowed");

  const myActiveBorrows = records.filter(
    (r) => r.userId === currentUser.id && r.status === "borrowed"
  );

  const overdue = activeBorrows.filter((r) => new Date(r.dueDate) < new Date());

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="page-subtitle">Welcome back, {currentUser.name} 👋</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{books.length}</div>
          <div className="stat-label">Unique Titles</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalBooks}</div>
          <div className="stat-label">Total Copies</div>
        </div>
        <div className="stat-card stat-card-green">
          <div className="stat-value">{totalAvailable}</div>
          <div className="stat-label">Available Now</div>
        </div>
        <div className="stat-card stat-card-orange">
          <div className="stat-value">{totalBorrowed}</div>
          <div className="stat-label">Currently Borrowed</div>
        </div>

        {currentUser.role === "admin" ? (
          <>
            <div className="stat-card">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Registered Users</div>
            </div>
            <div className="stat-card stat-card-red">
              <div className="stat-value">{overdue.length}</div>
              <div className="stat-label">Overdue Returns</div>
            </div>
          </>
        ) : (
          <div className="stat-card">
            <div className="stat-value">{myActiveBorrows.length}</div>
            <div className="stat-label">My Borrowed Books</div>
          </div>
        )}
      </div>

      {currentUser.role === "admin" && (
        <div className="card">
          <h3>Recent Activity</h3>
          {records.length === 0 ? (
            <p className="empty-text">No borrow activity yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>User</th>
                  <th>Borrowed On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records
                  .slice()
                  .reverse()
                  .slice(0, 6)
                  .map((r) => {
                    const book = books.find((b) => b.id === r.bookId);
                    const user = users.find((u) => u.id === r.userId);
                    return (
                      <tr key={r.id}>
                        <td>{book ? book.title : "Deleted book"}</td>
                        <td>{user ? user.name : "Unknown"}</td>
                        <td>{new Date(r.borrowDate).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              r.status === "borrowed" ? "badge-orange" : "badge-green"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
