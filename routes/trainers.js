const express = require('express');
const router = express.Router();
const trainerData = require('../data/trainers')

router.get('/', async (req,res) => { //this is just for demo. Actually it will be a post route
  //Validate user. User Should be a gym owner
//   if (req.session.user & req.session.user.role === 'owner'){
//       res.render('createTrainer',{})
    res.redirect("/createTrainer")
//   }else{
//       res.redirect("/login")
//   }

  
//Prepare trainer data 
//   let newTrainer = {
//             "trainerId" : 10000,
//             "trainerFirstName":'Raj',
//             "trainerLastName":'Shah',
//             "gymId": '61a0185650d4b2e6f6e5edfa',
//             "phoneNo": 123456789,
//             "overallRating": 0
//   }
//   try{
//     let res = await trainerData.createTrainer(newTrainer)
//   }catch(e){
//     console.log(e.message)
//   }
})

//To create a trainer
router.post('/createTrainer', async (req,res) => { 
  //Validate user. User Should be a gym owner
//   if (req.session.user & req.session.user.role === 'owner'){
    //Prepare trainer data 
    let newTrainer = {
        "trainerId" : 100001,
        "trainerFirstName":'Raj',
        "trainerLastName":'Shah',
        "gymId": '61a0185650d4b2e6f6e5edfa',
        "phoneNo": 123456789,
        "overallRating":0
    }
    try{
    let res = await trainerData.createTrainer(newTrainer)
    console.log('trainer created')
    }catch(e){
    console.log(e.message)
    }
//   }else{
//       res.redirect("/login")
//   }
  
})

router.get('/reviewTrainer', async (req,res) => { //this is just for demo. Actually it will be a post route
  //Validate user. User Should be a gym owner
    res.redirect('/createReviewTrainer')
})
router.post('/createReviewTrainer', async(req,res) => {
      //Prepare trainer data 
  let newTrainerReview = {
    "gymId" : "61a0185650d4b2e6f6e5edfa", //ObjectID will be stored here
    "trainerId" : 10000,
    "userId" : 1234,
    "date": trainerData.getTodaysDate(), //System Date can be open
    "reviewText": "Awesome",
    "reviewType": 'T',
    "rating": 1
  }
  try{
    let res = await trainerData.createTrainerReview(newTrainerReview)
  }catch(e){
    console.log(e.message)
  }
})
module.exports = router 

