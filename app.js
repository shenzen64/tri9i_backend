const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 9000;
const mongoose = require("mongoose");
const { MONGOURL } = require("./keys");
const fs = require('fs')
const fetch= require('node-fetch')
const School = require('./models/ecole') 

const token = '13916d1386c42103f86e67ea821df8b9'

mongoose.connect(MONGOURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected succesfully");
});

const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const trajetRouter = require("./routers/trajet");
const schoolRouter = require("./routers/school");

app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(trajetRouter);
app.use(userRouter);
app.use(schoolRouter);

app.get('/hello', async (req,res)=>{
  try {
    res.send({s:'Hello World'})
  } catch (error) {
    console.log('error')
  }
})

// JUST FOR TESTING
// app.get('/init',async (req,res)=>{
//   console.log("requete")
//   try {
    
//     let data = fs.readFileSync('finalData.json','utf-8')
//     data = JSON.parse(data)
    
//     // console.log(data)
//     data.forEach(async (ecole,i)=>{

//       try {
//       const school = new School({
//         ...ecole,
//         nom: ecole.nom ? ecole.nom : "--"
//       })
//       await school.save()
//       } catch (error) {
//         console.log(error)
//       }

//     })

//     res.send(data)

//   } catch (error) {
//     console.log(error)
//     res.status(420).send()
//   }
// })

app.listen(port, () => {
  console.log("SERVER IS UP IN PORT " + port);
});


// LOADING SCHOOLS DATA THEN ADING IT TO MONGODB

// const loadData =  async ()=> {
//   const schools =  fs.readFileSync("coords.txt",'utf-8')
//   const schoolsData =  schools.toString().split('\r\n\r\n')

  

//   // const adresses =  fs.readFileSync("./donnee/adresses.txt","utf-8")
//   // const adressesData = adresses.toString().split('\n')

// const data = []


// schoolsData.forEach(school=>{
  
//   const lines = school.split('\n')

//   const surnomEtNom = lines[0].split(',')
//   const surnom = surnomEtNom[0]
//   const nom = surnomEtNom[1]

//     const latEtLong = lines[1].split(',')
//     const lat = latEtLong[0]
//      const long = latEtLong[1]

//       data.push({
//         surnom,
//         nom,
//         adresse: lines[2],
//         coordinate: [lat,long]
//       })
    
// })

    

  

//   let jsonData = JSON.stringify(data)
//   fs.writeFileSync("finalData.json",jsonData)
  


//   return data
// }

// loadData()