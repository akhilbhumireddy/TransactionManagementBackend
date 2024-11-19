const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./transaction_db.sqlite", (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("SQLite Database connected.");
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        transaction_type TEXT NOT NULL CHECK(transaction_type IN ('DEPOSIT', 'WITHDRAWAL')),
        user_id INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('PENDING', 'COMPLETED', 'FAILED')),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;
