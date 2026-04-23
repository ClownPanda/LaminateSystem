const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// ✅ REGISTER (CREATE USER)
router.post("/register", async (req, res) => {
  try {
    console.log("HEADERS:", req.headers);
    console.log("BODY:", req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("🔥 LOGIN REQUEST BODY:", req.body);

    const username = req.body.username?.trim();
    const password = req.body.password;

    console.log("👉 Clean username:", username);
    console.log("👉 Password received:", password);

    const user = await User.findOne({ username });

    console.log("👤 USER FROM DB:", user);

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).send("User not found");
    }

    let isMatch;

    // 🔐 Handle both hashed + plain passwords (for debugging safety)
    if (user.password.startsWith("$2")) {
      console.log("🔐 Using bcrypt compare");
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      console.log("⚠️ Plain password detected in DB");
      isMatch = password === user.password;
    }

    console.log("🔑 PASSWORD MATCH RESULT:", isMatch);

    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      username: user.username,
    });

  } catch (err) {
    console.log("💥 LOGIN ERROR:", err);
    res.status(500).json(err);
  }
});
module.exports = router;