const express = require("express");
const db = require("../models/database");
const router = express.Router();

// Create Transaction
router.post("/api/transactions", (req, res) => {
  const { amount, transaction_type, user_id } = req.body;
  const query = `INSERT INTO transactions (amount, transaction_type, user_id, status) 
                 VALUES (?, ?, ?, 'PENDING')`;
  db.run(query, [amount, transaction_type, user_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      transaction_id: this.lastID,
      amount,
      transaction_type,
      status: "PENDING",
      user_id,
      timestamp: new Date(),
    });
  });
});

// Get Transactions by User
router.get("/api/transactions", (req, res) => {
  const { user_id } = req.query;
  const query = "SELECT * FROM transactions WHERE user_id = ?";
  db.all(query, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ transactions: rows });
  });
});

// Get Transaction by ID
router.get("/api/transactions/:transaction_id", (req, res) => {
  const { transaction_id } = req.params;
  const query = "SELECT * FROM transactions WHERE id = ?";
  db.get(query, [transaction_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Transaction not found" });
    res.json(row);
  });
});

// Update Transaction Status
router.put("/api/transactions/:transaction_id", (req, res) => {
  const { transaction_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status field is required" });
  }

  const updateQuery = "UPDATE transactions SET status = ? WHERE id = ?";
  db.run(updateQuery, [status, transaction_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const selectQuery = "SELECT * FROM transactions WHERE id = ?";
    db.get(selectQuery, [transaction_id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json({
        transaction_id: row.id,
        amount: row.amount,
        transaction_type: row.transaction_type,
        status: row.status,
        timestamp: row.timestamp,
      });
    });
  });
});

module.exports = router;
