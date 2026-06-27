import React, { useMemo, useState } from "react";
import { useLibrary } from "../LibraryContext.jsx";

export default function Catalog() {
  const { books, currentUser, records, borrowBook } = useLibrary();
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [message, setMessage] = useState(null);

  const genres = useMemo(() => {
    const set = new Set(books.map((b) => b.genre));
    return ["All", ...Array.from(set)];
  }, [books]);

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter === "All" || b.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  function hasBorrowed(bookId) {
    return records.some(
      (r) => r.bookId === bookId && r.userId === currentUser.id && r.status === "borrowed"
    );
  }

  function handleBorrow(bookId) {
    const result = borrowBook(bookId, currentUser.id);
    if (result.success) {
      setMessage({ type: "success", text: "Book borrowed successfully! Due in 14 days." });
    } else {
      setMessage({ type: "error", text: result.message });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="page">
      <h1>Book Catalog</h1>
      <p className="page-subtitle">Browse and borrow from our collection</p>

      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.text}
        </div>
      )}

      <div className="filters-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="books-grid">
        {filteredBooks.length === 0 && <p className="empty-text">No books match your search.</p>}
        {filteredBooks.map((book) => {
          const alreadyBorrowed = hasBorrowed(book.id);
          return (
            <div className="book-card" key={book.id}>
              <div className="book-card-genre">{book.genre}</div>
              <h3>{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <p className="book-year">{book.year}</p>
              <div className="book-availability">
                <span className={book.available > 0 ? "text-green" : "text-red"}>
                  {book.available} / {book.copies} available
                </span>
              </div>
              <button
                className="btn btn-primary btn-block"
                disabled={book.available <= 0 || alreadyBorrowed}
                onClick={() => handleBorrow(book.id)}
              >
                {alreadyBorrowed
                  ? "Already Borrowed"
                  : book.available <= 0
                  ? "Not Available"
                  : "Borrow Book"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
