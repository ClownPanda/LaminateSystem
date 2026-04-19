
const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/register", async (req,res)=>{
  const user = await User.create(req.body);
  res.json(user);
});

router.post("/login", async (req,res)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.status(400).send("User not found");

  const token = jwt.sign({id:user._id}, "secret");
  res.json({token});
});

module.exports = router;
