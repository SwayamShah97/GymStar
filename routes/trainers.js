const { ObjectId } = require('bson');
const express = require('express');
const router = express.Router();
const trainerData = require('../data/trainers')
const gymData = require('../data').gymData;
const xss = require('xss');
// const { validateTrainerReview } = require('../data/trainers');
function validateTrainerReview(review){
    if( 
        // ! review.rating ||
        ! review.starTR ||
        ! review.trainerId ||
        ! review.reviewTextTR) throw {status:400,message:'Kindly provide all valid inputs'}

    if( typeof(review.starTR) !== 'string'  ||
    typeof(review.trainerId ) !== 'string' ||
    typeof(review.reviewTextTR) !== 'string' ) throw {status:400,message:'Kindly provide all string inputs'}

    review.starTR = xss(review.starTR)
    review.trainerId = xss(review.trainerId)
    review.reviewTextTR = xss(review.reviewTextTR)

    review.starTR = review.starTR.trim()
    review.trainerId = review.trainerId.trim()
    review.reviewTextTR = review.reviewTextTR.trim()

    console.log(parseInt(review.starTR))
    if( ! parseInt(review.starTR) ||
        parseInt(review.starTR) < 0 ||
        parseInt(review.starTR) > 5 
        // || parseInt(review.starTR).isNaN()
         ) throw {status:400,message:'Invalid rating'}

    let objectIdRegex = /^[a-f\d]{24}$/i;
    if (!objectIdRegex.test(review.trainerId) || !ObjectId.isValid(review.trainerId))
    throw {status:400, message:"Invalid objectId for trainerId"};

    if(review.reviewTextTR.length === 0) throw {status:400,message:'Kindly provide proper review.'}

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

    if( typeof(trainer.trainerFirstName ) !== 'string' || 
    typeof(trainer.trainerLastName) !== 'string'  || 
    typeof(trainer.gymId) !== 'string'  ||
    typeof(trainer.gender) !== 'string'  ||
    typeof(trainer.phoneNo ) !== 'string' || 
    typeof(trainer.experience) !== 'string'  || 
    typeof(trainer.emailId) !== 'string' ) throw {status:400, message:'Kindly provide all string fields'}

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
router.get('/', async (req,res) => { 
  //Validate user. User Should be a gym owner
  if (req.session.user && req.session.user.role === 'owner'){
      try{
        //pullout this owners gyms
      let gymList = await trainerData.getGymByUsername(req.session.user.email)
      res.render('createTrainer',{gymList:gymList,title:'Create Trainer'}) //This will show trainer creation form and from that it will redirect it to create trainer post route
  
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
        res.render('createTrainer',{error:e.message,gymList:gymList,title:'Create Trainer'})
        
        }
  
})

router.get('/reviewTrainer/:id', async (req,res) => { //this is just for demo. Actually it will be a post route
  
   try{
        //Validate user. User Should be logged in.
        console.log(req.params.id) //Trainer's ID
        if(!req.params.id) throw {status:400,message:'Trainer ID is missing. Please provide it.'}
        let objectIdRegex = /^[a-f\d]{24}$/i;
        if(! objectIdRegex.test(req.params.id) ) throw{status:400,message:'Invalid Trainer Object ID'}
        if(req.session.user) {
            //Get selected trainer's details from DB
            const trainerDetails = await trainerData.getTrainersByTrainerId(req.params.id)
            if(! trainerDetails) throw{status:404,message:'Trainer Not found'}
            trainerDetails._id = trainerDetails._id.toString()
            res.render('createTrainerReview',{gymId:trainerDetails.gymId,
                                              trainerFirstname:trainerDetails.trainerFirstName,
                                              trainerLastname:trainerDetails.trainerLastName,
                                              trainerId:trainerDetails._id,
                                              title:'Trainer Review'})
        }else{
            req.session.gotoroute = 'trainers/createTrainerReview'
            res.redirect('/login')
        }
   }catch(e){
    res.status(e.status).render('somethingWentWrong', {message:e.message,title:"Something's wrong"})
   }
    
})
router.post('/createReviewTrainer', async(req,res) => {
    if(req.session.user){
        let trainerReview = ''
        try{
            console.log(req.body)
            //validate 
            trainerReview = validateTrainerReview(req.body)
        
            //Prepare trainer data 
            let newTrainerReview = {
            "userId" : req.session.user.email,
            "date": trainerData.getTodaysDate(), //System Date can be open
            "reviewText": trainerReview.reviewTextTR,
            "trainerId": trainerReview.trainerId,
            "rating": trainerReview.starTR,
            "reviewer": req.session.user.firstName
          }
        
            let resp = await trainerData.createTrainerReview(newTrainerReview)
            if(resp){
                // window.alert("Review submitted successfully")

                res.render('createTrainerReview',{success:'Review submitted successfully',
                                                  trainerFirstname:trainerReview.trainerFirstname,
                                                trainerLastname:trainerReview.trainerLastname,
                                                starTR:trainerReview.starTR,
                                                reviewTextTR:trainerReview.reviewTextTR,
                                                trainerId: trainerReview.trainerId,
                                                title:"Trainer Review"})
            }
          }catch(e){
            console.log(e.message)
          }
    }else{
        res.redirect('login')
    }
    
})

router.get('/gym/:id',async(req,res) => { //View trainers pertaining to given gym id
    try {
        console.log('Trainer List for gym ID: '+ req.params.id)
        const trainerList = await trainerData.getTrainersByGymId(req.params.id)

        if(trainerList){
            for(let t of trainerList){
                t._id = t._id.toString()
            }
            //render trainer list here
            res.render('trainerList',{
                trainers:trainerList,
                title:"Trainers"
            })  
        }
      
      
    }
    catch(e){
      res.status(e.status || 500)//.render();
    }
  
  }); 

  router.get('/trainer/:id',async(req,res) => {
      try{
          const trainer = await trainerData.getTrainersByTrainerId(req.params.id)
          const trainerReview = await trainerData.getTrainerReviewsByTrainerId(req.params.id)
          if(trainer){
              if(trainerReview){
                res.render('trainerProfile',{trainer:trainer,reviews:trainerReview,
                                                title:"Trainer Profile"})    
              }else{
                res.render('trainerProfile',{trainer:trainer,title:"Trainer Profile"})
              }
              
          }
          
      }catch(e){
          res.status(e.status || 500).json({error:e.message})
      }
  })


module.exports = router 

