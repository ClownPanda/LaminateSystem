const router = require("express").Router();
const Stock = require("../models/Stock");
const auth = require("../middleware/authMiddleware");

// ✅ GET (only user data)
router.get("/", auth, async (req, res) => {
  const { search } = req.query;

  let query = {
    userId: req.user.id,
  };

  if (search) {
    query.design = { $regex: search, $options: "i" };
  }

  const data = await Stock.find(query);
  res.json(data);
});

// ✅ CREATE
router.post("/", auth, async (req, res) => {
  const entry = await Stock.create({
    ...req.body,
    userId: req.user.id,
  });

  res.json(entry);
});

// ✅ UPDATE
router.put("/:id", auth, async (req, res) => {
  const updated = await Stock.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );

  res.json(updated);
});

// ✅ DELETE
router.delete("/:id", auth, async (req, res) => {
  await Stock.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  res.json({ msg: "Deleted" });
});

module.exports = router;