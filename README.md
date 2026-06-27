# Digital Library Management System

A frontend web app for managing a library's book catalog, built with React, Vite, and React Router. Users can sign up, log in, browse the catalog, borrow and return books, and admins can manage the book inventory. All data is saved in the browser (localStorage), so it persists between visits without needing a backend server.

## Features

- **Authentication** — sign up as a member, or log in as a member/admin
- **Dashboard** — quick stats (total titles, copies, available, borrowed, overdue)
- **Book Catalog** — search by title/author, filter by genre, borrow available books
- **My Books** — see your borrow history, due dates, and return books
- **Manage Books** (admin only) — add, edit, and delete books in the catalog
- Data persists in the browser via `localStorage`

## Demo accounts

| Role   | Email               | Password   |
|--------|---------------------|------------|
| Admin  | admin@library.com   | admin123   |
| Member | member@library.com  | member123  |

Or click "Sign up" to create your own member account.

## Tech stack

- React 18
- React Router v6
- Vite (build tool / dev server)
- Plain CSS (no external UI framework)

## Project structure

```
digital-library/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # entry point
    ├── App.jsx               # routes + route protection
    ├── index.css             # all styling
    ├── LibraryContext.jsx    # shared state: books, users, borrow records
    └── components/
        ├── Navbar.jsx
        ├── Login.jsx
        ├── Signup.jsx
        ├── Dashboard.jsx
        ├── Catalog.jsx
        ├── MyBooks.jsx
        └── ManageBooks.jsx
```

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Running on StackBlitz

1. Create a new Vite + React project on StackBlitz (or open an existing one).
2. Replace the generated files with the files from this repo, keeping the same folder structure.
3. StackBlitz auto-installs dependencies and starts the dev server.

## How data works

There's no backend — `LibraryContext.jsx` holds all app state (books, users, borrow records, current logged-in user) using React's `useState`, and syncs it to `localStorage` on every change with `useEffect`. On load, it reads back from `localStorage` (or falls back to seed data the very first time). This means refreshing the page does not lose your data, but clearing browser storage will reset it back to the demo data.
