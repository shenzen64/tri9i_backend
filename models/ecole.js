const mongoose = require("mongoose");


const rsSchema = new mongoose.Schema({
  surnom: {
    type: String,
    required:true
  },
  nom: {
    type: String,
    required:true
  },
  adresse: {
    type: String,
    trim: true,
  },
  coordinate: {
      type: Array,  // [lat,long]
      required:true
  },
});



const Ecole = mongoose.model("Ecole", rsSchema);
module.exports = Ecole;
