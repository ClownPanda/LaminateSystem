require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ ADD THIS

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"));

console.log("MONGO_URI:", process.env.MONGO_URI);


app.get("/test", (req, res) => {
  console.log("TEST HIT ✅");
  res.send("Server working");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stock", require("./routes/stockRoutes"));

app.listen(5000, () => console.log("Server running"));