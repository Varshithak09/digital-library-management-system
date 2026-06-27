import React, { createContext, useContext, useEffect, useState } from "react";

const LibraryContext = createContext(null);

// ---- Initial seed data (used only the very first time the app runs) ----
const seedBooks = [
  { id: "b1", title: "The Pragmatic Programmer", author: "David Thomas", genre: "Technology", year: 1999, copies: 3, available: 3 },
  { id: "b2", title: "Atomic Habits", author: "James Clear", genre: "Self-Help", year: 2018, copies: 4, available: 4 },
  { id: "b3", title: "1984", author: "George Orwell", genre: "Fiction", year: 1949, copies: 2, available: 2 },
  { id: "b4", title: "Sapiens", author: "Yuval Noah Harari", genre: "History", year: 2011, copies: 2, available: 2 },
  { id: "b5", title: "Clean Code", author: "Robert C. Martin", genre: "Technology", year: 2008, copies: 3, available: 3 },
  { id: "b6", title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", year: 1988, copies: 5, available: 5 },
];

const seedUsers = [
  { id: "u1", name: "Admin User", email: "admin@library.com", password: "admin123", role: "admin" },
  { id: "u2", name: "Riya Sharma", email: "member@library.com", password: "member123", role: "member" },
];

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(() => loadFromStorage("dlms_books", seedBooks));
  const [users, setUsers] = useState(() => loadFromStorage("dlms_users", seedUsers));
  const [records, setRecords] = useState(() => loadFromStorage("dlms_records", []));
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage("dlms_current_user", null));

  useEffect(() => { localStorage.setItem("dlms_books", JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem("dlms_users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("dlms_records", JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem("dlms_current_user", JSON.stringify(currentUser)); }, [currentUser]);

  // ---- Auth ----
  function login(email, password) {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      setCurrentUser(found);
      return { success: true };
    }
    return { success: false, message: "Invalid email or password." };
  }

  function signup(name, email, password) {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { success: false, message: "An account with this email already exists." };
    const newUser = { id: "u" + Date.now(), name, email, password, role: "member" };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  }

  function logout() {
    setCurrentUser(null);
  }

  // ---- Book CRUD (admin) ----
  function addBook(book) {
    const newBook = { ...book, id: "b" + Date.now(), available: Number(book.copies) };
    setBooks((prev) => [...prev, newBook]);
  }

  function updateBook(id, updates) {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const merged = { ...b, ...updates };
        const borrowedCount = b.copies - b.available;
        merged.available = Math.max(0, Number(merged.copies) - borrowedCount);
        return merged;
      })
    );
  }

  function deleteBook(id) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setRecords((prev) => prev.filter((r) => r.bookId !== id));
  }

  // ---- Borrow / Return ----
  function borrowBook(bookId, userId) {
    const book = books.find((b) => b.id === bookId);
    if (!book || book.available <= 0) {
      return { success: false, message: "No copies available right now." };
    }
    const alreadyBorrowed = records.some(
      (r) => r.bookId === bookId && r.userId === userId && r.status === "borrowed"
    );
    if (alreadyBorrowed) {
      return { success: false, message: "You already have this book borrowed." };
    }

    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, available: b.available - 1 } : b))
    );

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const newRecord = {
      id: "r" + Date.now(),
      bookId,
      userId,
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString(),
      returnDate: null,
      status: "borrowed",
    };
    setRecords((prev) => [...prev, newRecord]);
    return { success: true };
  }

  function returnBook(recordId) {
    const record = records.find((r) => r.id === recordId);
    if (!record) return { success: false, message: "Record not found." };

    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId ? { ...r, status: "returned", returnDate: new Date().toISOString() } : r
      )
    );
    setBooks((prev) =>
      prev.map((b) =>
        b.id === record.bookId ? { ...b, available: Math.min(b.copies, b.available + 1) } : b
      )
    );
    return { success: true };
  }

  const value = {
    books,
    users,
    records,
    currentUser,
    login,
    signup,
    logout,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within a LibraryProvider");
  return ctx;
}
