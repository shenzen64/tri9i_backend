const mongoose = require("mongoose");
const moment = require("moment");
const { ObjectId } = mongoose.Schema.Types;
const trajetSchema = new mongoose.Schema(
  {
    conducteur: {
      type: ObjectId,
      ref: "User",
    },
    nombreMax: {
      type: Number,
      required: true,
    },
    prix:{
      type: Number,
    },
    depart: {
      type: Array, // [lat,long]
      required:true
    },
    adresseDepart: {
      type: String, 
      required:true
    },
    recurssif:{
      type: String // "LmMV" pour Lundi, mardi, Mercredi, Vendredi
    },
    destination: {
      type: ObjectId,
      ref: "Ecole",
    },
    date: {
      type: Date,
      required:true
    },
    passagers: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: { currentTime: () => moment() },
  }
);

const Trajet = mongoose.model("Trajet", trajetSchema);
module.exports = Trajet;
