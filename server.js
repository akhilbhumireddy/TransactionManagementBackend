const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const transactionRoutes = require("./routes/transactions");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(transactionRoutes);

const PORT = 2000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
