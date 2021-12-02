const express = require('express');
const router = express.Router();
const gymData = require('../data').gymData;
// const gymData = data.gyms;


router.get('/', async (req, res) => {
    try {
      let gymList = await gymData.getTopFive();
      res.render('gymbars/gymlist',{gyms:gymList})

    } catch (e) {
      res.sendStatus(500);
    }
  });

  router.get('/gymcreate',async(req,res) => {

    try{
      res.render('gymbars/creategym')
    }
    catch(e){
      res.sendStatus(500);
    }
  });

  router.get('/:id',async(req,res) => {
    try {
      const gym = await gymData.getGym(req.params.id)
      const reviews = await gymData.getReviews(req.params.id);
      res.render('gymbars/gymprofile',{gym:gym,reviews:reviews})
    }
    catch(e){
      res.sendStatus(500);
    }
  
  }); 


router.post('/gymcreate',async(req,res) => {
  
   let userName = req.session.user.email;
   let gymName = req.body.firstname;
   let location = req.body.city;
   let phoneNumber = req.body.mobile;
   let priceRange = req.body.price;
  
   try{
     const creategym = await gymData.create(userName,gymName,location,phoneNumber,priceRange);
    
     if(creategym){
       res.status(200).redirect('/gyms')
       }
   else {
       res.status(500).render('gymbars/creategym', {title: "Error", error: 'Internal Server Error'})
       }
   }
   catch(e){
       res.sendStatus(500)
   }

      
 
  });


module.exports = router;