const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");


function matchExact(r, str) {
const match = str.match(r);
return match && str === match[0];
}

function validateCIN(cin){
const re = /^[A-Z][A-Z][1-9]+/i
return re.test(cin) && cin.length <9 && cin.length > 4
}


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cin: {
    type: String,
    required: true,
    validate(value) {
      if (!validateCIN(value)) throw new Error("Not Valid CIN");
    },
  },
  phone: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isMobilePhone(value)) throw new Error("Not Valid Phone");
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Not Valid Email");
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  trajets: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Trajet",
    },
  ]
});

// RELATIONSHIP BETWEEN USER AND Trajet

userSchema.virtual("trajetAjoute", {
  ref: "Trajet",
  localField: "_id",
  foreignField: "passagers",
});

// GENERATING WEB TOKENS

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id.toString() }, JWT_SECRET);
  return token;
};

// LOGIN

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Unable to find user");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Unvalid Password");

  return user;
};

// HASHING PASSWORD

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
