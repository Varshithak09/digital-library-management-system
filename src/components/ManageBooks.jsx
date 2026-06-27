import React, { useState } from "react";
import { useLibrary } from "../LibraryContext.jsx";

const emptyForm = { title: "", author: "", genre: "", year: "", copies: 1 };

export default function ManageBooks() {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.author || !form.genre || !form.year || !form.copies) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    if (editingId) {
      updateBook(editingId, {
        title: form.title,
        author: form.author,
        genre: form.genre,
        year: Number(form.year),
        copies: Number(form.copies),
      });
      setMessage({ type: "success", text: "Book updated successfully." });
    } else {
      addBook({
        title: form.title,
        author: form.author,
        genre: form.genre,
        year: Number(form.year),
        copies: Number(form.copies),
      });
      setMessage({ type: "success", text: "Book added successfully." });
    }

    setForm(emptyForm);
    setEditingId(null);
    setTimeout(() => setMessage(null), 2500);
  }

  function handleEdit(book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
      copies: book.copies,
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this book? This will also remove its borrow history.")) {
      deleteBook(id);
    }
  }

  return (
    <div className="page">
      <h1>Manage Books</h1>
      <p className="page-subtitle">Add, edit, or remove books from the library (Admin only)</p>

      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h3>{editingId ? "Edit Book" : "Add New Book"}</h3>
        <form className="inline-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={form.author}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              value={form.genre}
              onChange={handleChange}
            />
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={form.year}
              onChange={handleChange}
            />
            <input
              type="number"
              name="copies"
              min="1"
              placeholder="Copies"
              value={form.copies}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Save Changes" : "Add Book"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Copies</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.genre}</td>
              <td>{b.year}</td>
              <td>{b.copies}</td>
              <td>{b.available}</td>
              <td>
                <button className="btn btn-secondary btn-small" onClick={() => handleEdit(b)}>
                  Edit
                </button>{" "}
                <button className="btn btn-danger btn-small" onClick={() => handleDelete(b.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
