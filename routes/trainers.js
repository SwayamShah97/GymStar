const { ObjectId } = require('bson');
const express = require('express');
const router = express.Router();
const trainerData = require('../data/trainers')
const gymData = require('../data').gymData;
const xss = require('xss');
// const { validateTrainerReview } = require('../data/trainers');
function validateTrainerReview(review){
    if( ! review.rating ||
        ! review.trainerId ||
        ! review.reviewText) throw {status:400,message:'Kindly provide all valid inputs'}

    review.rating = xss(review.rating)
    review.trainerId = xss(review.trainerId)
    review.reviewText = xss(review.reviewText)

    review.rating = review.rating.trim()
    review.trainerId = review.trainerId.trim()
    review.reviewText = review.reviewText.trim()

    if( ! parseInt(review.rating) ||
        parseInt(review.rating) < 0 ||
        parseInt(review.rating) > 5 ||
        review.rating.isNaN()
         ) throw {status:400,message:'Invalid rating'}

    let objectIdRegex = /^[a-f\d]{24}$/i;
    if (!objectIdRegex.test(review.trainerId) || !ObjectId.isValid(review.trainerId))
    throw {status:400, message:"Invalid objectId for trainerId"};

    if(review.reviewText.length === 0) throw {status:400,message:'Kindly provide proper review.'}

    return review
}
function validateTrainerDetails(trainer){

    if(!trainer.trainerFirstName || 
        !trainer.trainerLastName || 
        !trainer.gymId ||
        !trainer.gender ||
        !trainer.phoneNo || 
        !trainer.experience || 
        !trainer.emailId) throw {status:400, message:'Kindly provide all the fields'}

    //XSS
    trainer.trainerFirstName  = xss(trainer.trainerFirstName )
    trainer.trainerLastName = xss(trainer.trainerLastName)
    trainer.gymId = xss(trainer.gymId)
    trainer.gender = xss(trainer.gender)
    trainer.phoneNo = xss(trainer.phoneNo)
    trainer.emailId = xss(trainer.emailId)
    trainer.experience = xss(trainer.experience)

    trainer.trainerFirstName  = trainer.trainerFirstName.trim()
    trainer.trainerLastName = trainer.trainerLastName.trim()
    trainer.gymId = trainer.gymId.trim()
    trainer.gender = trainer.gender.trim()
    trainer.phoneNo = trainer.phoneNo.trim()
    trainer.emailId = trainer.emailId.trim()
    trainer.experience = trainer.experience.trim()

    let spregex = /[^\w]/g
    let spaceRegex = /\s/g
    let numberRegex = /[0-9]/g
    if(spaceRegex.test(trainer.trainerFirstName) ||
        spregex.test(trainer.trainerFirstName) ||
        numberRegex.test(trainer.trainerFirstName)) throw  {status:400,message:'Invalid First Name'} 

    if(spaceRegex.test(trainer.trainerLastName) ||
        spregex.test(trainer.trainerLastName) ||
        numberRegex.test(trainer.trainerLastName)) throw  {status:400,message:'Invalid Last Name'} 
           
    if(!(trainer.gender === 'Male' || 
        trainer.gender === 'Female' || 
        trainer.gender === 'Other')) throw {status:400,message:'Invalid Gender'}

    
    // let phoneNumberRegex = /^\d{3}-\d{3}-\d{4}$/; // Google: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/
    let phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(trainer.phoneNo)) throw {status:400,message:'Invalid Number Format'}
    //trainer.phoneNo = parseInt(trainer.phoneNo)

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(! emailRegex.test(trainer.emailId) ) throw {status:400,message:'Invalid Email Address'}

    let numRegex = /^\d+$/
    if(! numRegex.test(trainer.experience)) throw {status:400,message:'Invalid experience'}
    if( parseInt(trainer.experience) < 0  || parseInt(trainer.experience) > 100 ) throw {status:400,message:'Kindly provide valid experience'}
    //trainer.experience = parseInt(trainer.experience)

    let objectIdRegex = /^[a-f\d]{24}$/i;
        if (!objectIdRegex.test(trainer.gymId) || !ObjectId.isValid(trainer.gymId))
        throw {status:400, message:"Invalid objectId for GymId"};

    return trainer
}
router.get('/', async (req,res) => { //this is just for demo. Actually it will be a post route
  //Validate user. User Should be a gym owner
  if (req.session.user && req.session.user.role === 'owner'){
      try{
        //pullout this owners gyms
      let gymList = await trainerData.getGymByUsername(req.session.user.email)
      res.render('createTrainer',{gymList:gymList}) //This will show trainer creation form and from that it will redirect it to create trainer post route
  
      }catch(e){
          res.status(e.status || 500 ).json(e.message)
      }
      
  }else{
      req.session.gotoroute = 'trainers/createTrainer'
      res.redirect("/login")
  }

})

//To create a trainer
router.post('/createTrainer', async (req,res) => { 
    let gymList = undefined
    try{
          //pullout this owners gyms
      gymList = await trainerData.getGymByUsername(req.session.user.email)
  
    //Validate user. User Should be a gym owner
    if (req.session.user && req.session.user.role === 'owner'){
        //Prepare trainer data 
        let trainer = validateTrainerDetails(req.body)
        console.log(req.body)
        let newTrainer = {
        
        "trainerFirstName": trainer.trainerFirstName,
        "trainerLastName":trainer.trainerLastName,
        "gymId": trainer.gymId, //ObjectId(trainer.gymId),
        "phoneNo": trainer.phoneNo ,
        "overallRating":0,
        "emailId":trainer.emailId,
        "gender":trainer.gender,
        "experience":trainer.experience

    }
    
        let resp = await trainerData.createTrainer(newTrainer)
        if(resp){
            console.log('trainer created')
            res.redirect('/userprofile') 
        }
    
    
    }else{
        res.redirect("/login")
    }
    }catch(e){
        console.log(e.message)
        res.render('createTrainer',{error:e.message,gymList:gymList})
        
        }
  
})

router.get('/reviewTrainer', async (req,res) => { //this is just for demo. Actually it will be a post route
  //Validate user. User Should be logged in.
    if(req.session.user) {
        //Get selected trainer's details from DB
        res.render('createTrainerReview',{gymId:'gymid123',trainerFirstname:'myfname',trainerLastname:'mylastname'})
    }else{
        req.session.gotoroute = 'trainers/createTrainerReview'
        res.redirect('/login')
    }
    
})
router.post('/createReviewTrainer', async(req,res) => {
    try{
    console.log(req.body)
    //validate 
    let trainerReview = validateTrainerReview(req.body)

    //Prepare trainer data 
    let newTrainerReview = {
    "userId" : req.session.user.emailId,
    "date": trainerData.getTodaysDate(), //System Date can be open
    "reviewText": trainerReview.reviewText,
    "trainerId": trainerReview.trainerId,
    "rating": trainerReview.rating,
    "reviewer": req.session.user.firstName
  }

    let res = await trainerData.createTrainerReview(newTrainerReview)
  }catch(e){
    console.log(e.message)
  }
})


module.exports = router 

