const express = require("express");
const { ToysModel, valiDateToys } = require("../models/toysModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();
 
router.get("/", async (req, res) => {
    const perPage = 10;
    const page = req.query.page -1 || 0
    const search = req.query.s;
    let filterToys = {}
    if(search){
      const searchExp = new RegExp(search,"i");
      filterToys ={$or:[{info:searchExp},{name:searchExp}]}
    }
  try {
    const data = await ToysModel
    .find(filterToys)
    .limit(perPage)
    .skip(page*perPage)
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/price",async(req,res)=>{
  const min = req.query.min || 0;
  const max = req.query.max || Infinity
  try{
    const data = await ToysModel.find({price:{$gte:min,$lte:max}})
    res.json(data)
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/category/:catname",async(req,res)=>{
  try{
    const catname = req.params.catname
    const data = await ToysModel.findOne({category:catname})
    res.json(data)
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
 
})

router.get("/single/:id",async(req,res)=>{
  try{
    const id = req.params.id
    const data = await ToysModel.findOne({_id:id})
    res.json(data)
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.post("/",auth ,async (req, res) => {
  const validBody = valiDateToys(req.body);
  if (validBody.error)
   return res.status(401).json(validBody.error.details);
  try {
    const toys = new ToysModel(req.body);
    toys.user_id = req.tokenData._id
    await toys.save();
    res.json(toys);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});


router.put("/:editId",auth,async(req,res)=>{
    const validBody = valiDateToys(req.body);
  if (validBody.error)
   return res.status(401).json(validBody.error.details);
   try{
    const id = req.params.editId
    const data = await ToysModel.updateOne({_id:id,user_id:req.tokenData._id},req.body)
    res.json(data)
}
catch(err){
    console.log(err);
    res.status(502).json({err})
}
})

router.delete("/:deletId",auth,async(req,res)=>{
  try{
      const id = req.params.deletId
      const data = await ToysModel.deleteOne({_id:id,user_id:req.tokenData._id})
      res.json(data)
  }
  catch(err){
      console.log(err);
      res.status(502).json({err})
  }
})

module.exports = router;
