
const router = require("express").Router();
const Stock = require("../models/Stock");

router.get("/", async (req,res)=>{
  const {search} = req.query;
  let query = {};
  if(search){
    query.design = {$regex:search,$options:"i"};
  }
  const data = await Stock.find(query);
  res.json(data);
});

router.post("/", async (req,res)=>{
  const entry = await Stock.create(req.body);
  res.json(entry);
});

router.put("/:id", async (req,res)=>{
  const updated = await Stock.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(updated);
});

router.delete("/:id", async (req,res)=>{
  await Stock.findByIdAndDelete(req.params.id);
  res.json({msg:"Deleted"});
});

module.exports = router;
