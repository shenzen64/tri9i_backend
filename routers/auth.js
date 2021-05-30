const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(422).json({
      error: "Please provide the info",
    });
  }

  try {
    const user = new User(req.body);
    await user.save();
    res.json({
      success: "Signup succesfully",
    });
  } catch (error) {
    if (error.code == 11000) {
      res.status(500).json({
        error: "Email Already Token",
      });
    } else res.status(500).json({ error: "ERROR" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(422)
        .json({ error: "Please provide an username and password" });
    }
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).json({
      error: "Failed to authenticate",
    });
  }
});

module.exports = router;
