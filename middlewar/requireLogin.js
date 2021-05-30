const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../keys");

const requireLogin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
    });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate" });
  }
};
module.exports = requireLogin;
