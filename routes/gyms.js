const express = require('express');
const router = express.Router();
const gymData = require('../data').gymData;
const xss = require('xss');



router.get('/', async (req, res) => {
    try {
      let gymList = await gymData.getTopFive();
      res.render('gymbars/gymlist',{gyms:gymList});

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

  router.get('/gymupdate',async(req,res) => {
    
    
      const user = req.session.user.email;
    
      const values = await gymData.getGymWithUser(user);
      
    try{
      res.render('gymbars/updategym',{values:values})
      //res.render('gymbars/updategym')
    }
    catch(e){
      res.sendStatus(500);
    }
  });

  router.get('/allgyms',async(req,res) => {

    try{
      let gymList = await gymData.getAllGyms();
      res.render('gymbars/allgyms',{gyms:gymList});
    }
    catch(e){
      res.sendStatus(500);
    }
  });
  

  router.get('/:id',async(req,res) => {
    try {
      const gym = await gymData.getGym(req.params.id);
      const reviews = await gymData.getReviews(req.params.id);
      const rating = await gymData.calcRating(req.params.id)
      res.render('gymbars/gymprofile',{gym:gym,reviews:reviews,rate:rating})
      
    }
    catch(e){
      res.sendStatus(500);
    }
  
  }); 

  
  router.post('/gymupdate',async(req,res) => {

  
  }); 

  
  router.post('/gymupdate',async(req,res) => {

    
      let gymName = req.body.firstname;
      let location = req.body.city;
      let phoneNumber = req.body.mobile;
      let priceRange = req.body.price;
      let id = await gymData.getId(gymName)
      console.log(id)
      const updategym = await gymData.update(id,gymName,location,phoneNumber,priceRange)
     try{
      if(updategym)
        res.status(200).redirect('/gyms')
      else {
          res.status(500).render('gymbars/updategym', {title: "Error", error: 'Internal Server Error'})
      }
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

  // // Added by Malay for gym filter
  // function validateFilter(filter) {
  //   filter.rating = xss(filter.rating)
  //   filter.priceRange = xss(filter.priceRange)

  //   filter.rating = filter.rating.trim()
  //   filter.priceRange = filter.priceRange.trim()

  //   let tempRating = filter.rating
  //   if(! /^[1-5]{1}$/.test(filter.rating)) throw {status:400,message:'Invalid Rating'}

  //   if( filter.rating && !( /^[1-5]{1}$/.test(filter.rating))) //4 because there will be 0-4 in select option
  //   {
  //     throw {status:400,message:'Invalid Rating'}
  //   }
  //   let priceRangeRegex = /^[$]{1,4}$/;
  //   if(filter.priceRange && (! priceRangeRegex.test(filter.priceRange))) throw {
  //     status:400,
  //     message:'Invalid price Range'
  //   }
  //   return filter

  // }
  


  router.get('/gfilter',async(req,res) => {
    console.log('Inside filter')
    try{
      // let filter = validateFilter(req.body)
      
      let gymList = await gymData.getFilterData()
      if(gymList){
        
        res.render('gymbars/gymlist',{gyms:gymList})
      }else{
        
        res.render('noseearch',{})
      }

    }catch(e){
      res.status(e.status || 500).json(e.message)
    }
    
  })

  router.get('/:id',async(req,res) => { //Keep this as the last route function
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

module.exports = router;