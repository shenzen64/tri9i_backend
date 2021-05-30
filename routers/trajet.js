const express = require("express");
const router = express.Router();
const moment = require("moment");
const Trajet = require("../models/trajet");
const User = require("../models/user");
const requireLogin = require("../middlewar/requireLogin");
require("moment/locale/fr-ca")
moment().locale("fr-ca")

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

const daysShort = ['L','m','M','J','V','S','D']
const week = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]

function sortStr(str){
  let finalStr = ''
  const arr = Array.from(str)

  let d;

  do{
  d= 0
  for(let i = 0; i < arr.length -1 ; i++){
      
      if(daysShort.indexOf(arr[i]) > daysShort.indexOf(arr[i+1])){
          
          d=1
          let c = ''
          c = arr[i]
          arr[i] = arr[i+1]
          arr[i+1] = c
      }
  }
  } while(d==1)

  arr.forEach(letter=>{
      finalStr +=letter
  })

  return finalStr
}

function processTrajets(trajets){
  const processedTrajets = []
  trajets.forEach(trajet => {
    if(trajet.recurssif){

      const days = Array.from(sortStr(trajet.recurssif))

      let finalStr = 'Chaque '
      days.forEach((day,i)=>{
        finalStr += `${week[daysShort.indexOf(day)]}${i!=days.length-1 ? "," : ""} `
      })

      finalStr+= `à ${moment(trajet.date).format("HH:mm")}`
      const currTrajet = trajet.toObject()
      currTrajet.dateStr =  finalStr
      processedTrajets.push(currTrajet)
       
    } else {
      const now = moment()
      if(moment(trajet.date).isAfter(now)){
        const date = moment(trajet.date)
        const str =  `Le ${date.format('dddd')} ${date.format('DD')} ${date.format('MMMM')} ${date.format('YYYY')} à ${date.format("HH:mm")}`
        const currTrajet = trajet.toObject()
        currTrajet.dateStr = str
        processedTrajets.push(currTrajet)
      }
    }
  });
  return processedTrajets
}


router.get("/allTrajets", async (req, res) => {
  try {
    const trajets = await Trajet.find({}).populate("destination","_id surnom coordinate")
    res.send(processTrajets(trajets));
  } catch (error) {
    res.status(422).json({
      error: "ERROR",
    });
  }
});

router.post("/createTrajet", requireLogin, async (req, res) => {
  try {
    const trajet = new Trajet({
      ...req.body,
      conducteur: req.user._id,
    });
    
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          trajets: trajet._id,
        },
      },
      {
        new: true,
      }
    )

    await trajet.save();
    res.send(trajet);
  } catch (error) {
    console.log(error)
    res.status(422).json({
      error: "ERROR",
    });
  }
});

router.put("/addTrajet/:id", requireLogin, async (req, res) => {
  try {

    const checkTrajet = await Trajet.findById(req.params.id)


    if(checkTrajet.passagers.includes(req.user._id)){
      return res.json({
        error : " Erreur: Trajet Deja Ajouté"
      })
    } 

    if(checkTrajet.passagers.length >= checkTrajet.nombreMax) {
      return res.json({
        error : " Erreur: Le Trajet Est Déja Plein"
      })
    }

    const trajet = await Trajet.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          passagers: req.user._id,
        },
      },
      {
        new: true,
      }
    ).populate("destination", "_id surnom")
    res.send(trajet);
  } catch (error) {
    console.log(error)
    res.status(422).json({
      error: "ERROR",
    });
  }
});

router.get("/trajets/:id", async (req, res) => {
  try {
    const trajets = await Trajet.find({destination : req.params.id})
    .populate('destination','_id surnom nom coordinate')

    res.send(processTrajets(trajets));
  } catch (error) {
    res.status(422).json({
      error: "ERROR",
    });
  }
});

router.get("/singleTrajet/:id", async (req, res) => {
  try {
    const trajet = await Trajet.findById(req.params.id)
    .populate('conducteur','_id name phone')
    .populate('destination','_id coordinate')
    res.send(processTrajets([trajet])[0]);
  } catch (error) {
    res.status(422).json({
      error: "ERROR",
    });
  }
});

router.get('/joinedTrajets',requireLogin,async (req,res)=>{
  try {
    const trajets = await Trajet.find({passagers:{ $in : req.user._id }})
    .select('adresseDepart destination')
    .populate('destination','_id surnom')
    res.send(trajets);
  } catch (error) {
    res.status(422).json({
      error: "ERROR",
    });
  }
})

router.patch('/updateTrajet/:id',requireLogin,async (req,res)=>{
  try {
    const trajetToUpdate = await Trajet.findById(req.params.id)

    if(  trajetToUpdate.conducteur.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        error: "Vous N'avez Pas Le Droit De Mettre A Jour Ce Trajet",
      });
    }

    const trajet = await Trajet.findByIdAndUpdate(req.params.id,{
      ...req.body
    }, {
      new:true
    } )
   
    res.send(trajet);
  } catch (error) {
    res.status(422).json({
      error: "ERROR",
    });
  }
})

router.delete('/deleteTrajet/:id',requireLogin,async (req,res)=>{
  try {
    const trajetToDelete = await Trajet.findById(req.params.id)
    if(trajetToDelete.conducteur.toString() != req.user._id.toString()) {
      return res.status(401).json({
        error: "Vous N'avez Pas Le Droit De Supprimer Ce Trajet",
      });
    }
    const trajet = await Trajet.findByIdAndDelete(req.params.id)
   
    res.send(trajet);
  } catch (error) {
    console.log(error)
    res.status(422).json({
      error: "ERROR",
    });
  }
})

router.put('/deleteFromTrajet/:id',requireLogin,async (req,res)=>{
  try {

    const trajet = await Trajet.findByIdAndUpdate(req.params.id,{
      $pull: {
         passagers: req.user._id,
      },
    },{
      new:true
    })
   
    res.send(trajet);
  } catch (error) {
    console.log(error)
    res.status(422).json({
      error: "ERROR",
    });
  }
})


module.exports = router;
