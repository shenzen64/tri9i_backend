const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const requireLogin = require("../middlewar/requireLogin");
const moment = require("moment");


router.get("/user/trajets", requireLogin, async (req, res) => {
  try {
    const trajets = await User.findById(req.user._id)
    .select('trajets')
    .populate({
        path : 'trajets',
        select: '_id adresseDepart destination',
        populate: {
            path :'destination',
            select: '_id surnom'
        }
    })

    res.send(trajets);
  } catch (error) {
    return res.status(404).json({
      error: "Unable To Found Trajets",
    });
  }
});

router.get("/userInfo", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    .select('name phone email cin')
    
    res.send(user);

  } catch (error) {
    return res.status(404).json({
      error: "Unable To Found Trajets",
    });
  }
});

router.put("/updateInfo", requireLogin, async (req, res) => {
  const allowedUpdates = ["name", "cin","phone", "email"];
  const updates = Object.keys(req.body);

  const isAllowed = updates.every((update) => allowedUpdates.includes(update));
  if (!isAllowed) return res.status(400).send({ error: "Not Valid Update!" });
  try {
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();
    user.password = undefined
    res.send(user);
  } catch (e) {
    console.log(e)
    res.status(400).send(e);
  }
});

router.put("/updatePassword", requireLogin, async (req, res) => {

   try {
    const user = req.user;
    const { oldPassword,newPassword } = req.body
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    
    if(isMatch){
      user["password"] = newPassword
    } else {
      return res.status(400).json({
        error : "Invalid Password"
      })
    }
    await user.save();
    user.password = undefined
    res.send(user);
  } catch (e) {
    console.log(e)
    res.status(400).send(e);
  }
});


module.exports = router;
