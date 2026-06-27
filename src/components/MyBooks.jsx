import React from "react";
import { useLibrary } from "../LibraryContext.jsx";

export default function MyBooks() {
  const { records, books, currentUser, returnBook } = useLibrary();

  const myRecords = records
    .filter((r) => r.userId === currentUser.id)
    .slice()
    .reverse();

  function handleReturn(recordId) {
    returnBook(recordId);
  }

  function isOverdue(record) {
    return record.status === "borrowed" && new Date(record.dueDate) < new Date();
  }

  return (
    <div className="page">
      <h1>My Books</h1>
      <p className="page-subtitle">Track what you've borrowed and returned</p>

      {myRecords.length === 0 ? (
        <div className="card">
          <p className="empty-text">You haven't borrowed any books yet. Head to the Catalog to get started!</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Borrowed On</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {myRecords.map((r) => {
              const book = books.find((b) => b.id === r.bookId);
              const overdue = isOverdue(r);
              return (
                <tr key={r.id}>
                  <td>{book ? book.title : "Deleted book"}</td>
                  <td>{book ? book.author : "—"}</td>
                  <td>{new Date(r.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(r.dueDate).toLocaleDateString()}</td>
                  <td>
                    {r.status === "returned" ? (
                      <span className="badge badge-green">returned</span>
                    ) : overdue ? (
                      <span className="badge badge-red">overdue</span>
                    ) : (
                      <span className="badge badge-orange">borrowed</span>
                    )}
                  </td>
                  <td>
                    {r.status === "borrowed" ? (
                      <button className="btn btn-secondary btn-small" onClick={() => handleReturn(r.id)}>
                        Return
                      </button>
                    ) : (
                      <span className="text-muted">
                        {r.returnDate && new Date(r.returnDate).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
