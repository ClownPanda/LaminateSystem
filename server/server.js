require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB Connected"));
console.log("MONGO_URI:", process.env.MONGO_URI);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stock", require("./routes/stockRoutes"));

app.listen(5000, ()=>console.log("Server running"));
