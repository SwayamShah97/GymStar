const express = require('express');
const router = express.Router();
const gymData = require('../data').gymData;
const xss = require('xss');

function checkString(string){
  if(typeof(string) !== 'string') throw 'Input provided is not a string';
  if(string.trim().length === 0) throw 'Empty string on input';
}

function check(userName,gymName,location,phoneNumber,priceRange){
  
  if(!userName) throw 'You must provide a name to add gym';
  if(!gymName) throw 'You must provide a gym name to add gym';
  if(!location) throw 'You must provide a location to add gym';
  if(!phoneNumber) throw 'You must provide a phone number to add gym';
  if(!priceRange) throw 'You must provide a price range to add gym';
  checkString(userName);
  checkString(gymName)
  checkString(location);
  checkString(phoneNumber);
  checkString(priceRange);
  let regEmail = userName.search(/^([a-zA-Z0-9_.+-]{1,})(@{1})([a-zA-Z]{1})([a-zA-Z0-9-]{1,})([.]{1})([a-zA-Z]{1,})$/gi);
  if (regEmail === -1) throw 'Email not valid'
  isphone = /[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phoneNumber);
  if (!isphone) throw 'Phone number does not follow format xxx-xxx-xxxx';
  if(!(priceRange=== '$' || priceRange=== '$$' || priceRange=== '$$$' || priceRange=== '$$$$')) throw 'priceRange is not between $ to $$$$';
  location = location.toLowerCase();
  if(location!= "jersey city" && location != "hoboken") throw "Select valid city"
}

function check2(gymName,location,phoneNumber,priceRange){
  
  if(!gymName) throw 'You must provide a gym name to add gym';
  if(!location) throw 'You must provide a location to add gym';
  if(!phoneNumber) throw 'You must provide a phone number to add gym';
  if(!priceRange) throw 'You must provide a price range to add gym';
  checkString(gymName)
  checkString(location);
  checkString(phoneNumber);
  checkString(priceRange);
  
  isphone = /[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phoneNumber);
  if (!isphone) throw 'Phone number does not follow format xxx-xxx-xxxx';
  if(!(priceRange=== '$' || priceRange=== '$$' || priceRange=== '$$$' || priceRange=== '$$$$')) throw 'priceRange is not between $ to $$$$';
  location = location.toLowerCase();
  if(location!= "jersey city" && location != "hoboken") throw "Select valid city"
}

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
      if (req.session.user){
        res.render('gymbars/creategym')
      }
      else{
        res.render('login')
      }
    }
    catch(e){
      res.sendStatus(500);
    }
  });

  router.get('/gymupdate/:id',async(req,res) => {
    
    
      const id = req.params.id;
    
      const values = await gymData.getGym(id);
      
    try{
      if (req.session.user && req.session.user.role === 'owner'){
        res.render('gymbars/updategym',{values:values})
      }
      else if(req.session.user && req.session.user!=='owner')
        res.redirect('/login')
      else{
        res.redirect('/login')
      }
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
  

  router.post('/gymupdate/:id',async(req,res) => {

    
      let gymName = req.body.firstname;
      let location = req.body.city;
      let phoneNumber = req.body.mobile;
      let priceRange = req.body.price;
      let id = req.params.id;

      
     try{
      check2(gymName,location,phoneNumber,priceRange);
      if(!id) throw 'Pleaase provide an id';
      var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
      if(checkForHexRegExp.test(id)===false) throw 'Not a valid objectid';
      
    
      const updategym = await gymData.update(id,gymName,location,phoneNumber,priceRange)
      if(updategym)
        res.status(200).redirect('/gyms')
      else {
          res.status(500).render('gymbars/updategym', {title: "Error", error: 'Internal Server Error'})
      }
    }
    catch(e){
      res.status(400).render('gymbars/updategym', {title: "Error", error: e})
    }
  });

router.post('/gymcreate',async(req,res) => {
  
   let userName = req.session.user.email;
   let gymName = req.body.firstname;
   let location = req.body.city;
   let phoneNumber = req.body.mobile;
   let priceRange = req.body.price;
   try{
     check(userName,gymName,location,phoneNumber,priceRange);
   
     const creategym = await gymData.create(userName,gymName,location,phoneNumber,priceRange);
    
     if(creategym){
       res.status(200).redirect('/gyms')
       }
   else {
       res.status(500).render('gymbars/creategym', {title: "Error", error: 'Internal Server Error'})
       }
   }
   catch(e){
    res.status(400).render('gymbars/creategym', {title: "Error", error: e})
   }

      
 
  });

  router.post('/search', async (req, res) => {
  
    try{
      checkString(req.body.searchTerm)
      if (!req.body.searchTerm) res.status(400).render('gymbars/emptysearch')
      
      else{
        
        const marv = await gymData.search(req.body.searchTerm);
        if(marv.length < 1 || marv == undefined) res.render('gymbars/nosearch',{s:req.body.searchTerm});
        else
         res.render('gymbars/search',{marved:marv}); }
    } catch (e) {
      let gymList = await gymData.getTopFive();
      res.status(400).render('gymbars/gymlist', {gyms:gymList,title: "Error", error: e})
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

  /* router.get('/:id',async(req,res) => { //Keep this as the last route function
    try {
      const gym = await gymData.getGym(req.params.id)
      const reviews = await gymData.getReviews(req.params.id);
      const rating = await gymData.calcRating(req.params.id)
      res.render('gymbars/gymprofile',{gym:gym,reviews:reviews,rate:rating})
      
    }
    catch(e){
      res.status(400).render('gymbars/gymprofile', {title: "Error", error: e})
    }
  
  });  */

  router.get('/:id',async(req,res) => {
    try {
      if(req.session.user){
        
      let userEmail = req.session.user.email;
      const gym = await gymData.getGymByOwner(req.params.id,userEmail);
      owner = gym[1];
      console.log(owner)
      const reviews = await gymData.getReviews(req.params.id);
      const rating = await gymData.calcRating(req.params.id)
      res.render('gymbars/gymprofile',{gym:gym[0],reviews:reviews,rate:rating,owner:owner})
      }
      else{
        const gym = await gymData.getGym(req.params.id);
        let owner = false;
        const reviews = await gymData.getReviews(req.params.id);
        const rating = await gymData.calcRating(req.params.id)
        res.render('gymbars/gymprofile',{gym:gym,reviews:reviews,rate:rating,owner:owner})
      }
    }
    catch(e){
      res.status(400).render('gymbars/gymprofile', {title: "Error", error: e})
    }
  
  });

module.exports = router;