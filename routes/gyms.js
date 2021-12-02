const express = require('express');
const router = express.Router();
const gymData = require('../data').gymData;

router.get('/:id',async(req,res) => {
  try {
    const gym = await gymData.getGym(req.params.id)
    const reviews = await gymData.getReviews(req.params.id);
    const rating = await gymData.calcRating(req.params.id)
    res.render('gymbars/gymprofile',{gym:gym,reviews:reviews,rate:rating})
    
  }
  catch(e){
    res.sendStatus(500);
  }

}); 

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

  router.post('/search', async (req, res) => {
  
    try {
      if (!req.body.searchTerm) res.status(400).render('gymbars/emptysearch')
      else{
        const marv = await gymData.search(req.body.searchTerm);
        if(marv.length < 1 || marv == undefined) res.render('gymbars/nosearch',{s:req.body.searchTerm});
        else
         res.render('gymbars/search',{marved:marv}); }
    } catch (e) {
      res.status(404).json({ message: e.message });
    }
  
  });

module.exports = router;