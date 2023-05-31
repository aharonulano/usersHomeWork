const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { UserModel, validateUser, createToken, validateLogin } = require("../models/usersModel");
const { auth } = require("../middlewares/auth");

router.get("/", async (req, res) => {
    res.json({ msg:"Users endpoint"});
});

router.get("/userInfo",auth,async(req,res)=>{
  try{
    const user = await UserModel.findOne({_id:req.tokenData._id},{password:0})
    res.json(user)
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }

})

router.post("/", async (req, res) => {
  const validBody = validateUser(req.body);
  if (validBody.error) return res.status(401).json(validBody.error.details);
  try {
    const user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "*****";

    res.json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(401)
        .json({ msg: "email already in system", code: 11000 });
    }
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/login",async(req,res)=>{
    const validBody = validateLogin(req.body);
  if (validBody.error) return res.status(401).json(validBody.error.details);
  try{
    const user = await UserModel.findOne({email:req.body.email})
    if(!user){
        return res.status(401).json({msg:"email not found"})
    }
    const passwordValid =await bcrypt.compare(req.body.password,user.password)
    if(!passwordValid){
        return res.status(401).json({nsg:"password wrong"})
    }
    const token = createToken(user._id,user.role)
    res.json({token,role:user.role})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;
