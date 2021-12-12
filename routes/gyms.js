const express = require('express');
const router = express.Router();
const gymData = require('../data').gymData;
const userData = require("../data").userData;
const xss = require('xss');

function checkString(string){
  if(typeof(string) !== 'string') throw {status:400,message:'Input provided is not a string'};
  if(string.trim().length === 0) throw {status:400,message:'Empty string on input'};
  return true
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



// const logged = function (req, res, next) {
//   if(req.session.user){
//     loggedin = true
//   }
//   next()
// };
// router.use(logged);

router.get('/', async (req, res) => {
    try {
      if(req.session.user){
        loggedin = true
        let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
        let gymList = await gymData.getTopFive();
      res.render('gymbars/gymlist',{title:"Gyms",gyms:gymList,loggedin,name:fname});
      }
      else{
        loggedin = false
        let gymList = await gymData.getTopFive();
      res.render('gymbars/gymlist',{title:"Gyms",gyms:gymList,loggedin});
      }
      

    } catch (e) {
      res.sendStatus(500);
    }
  });

  router.get('/gymcreate',async(req,res) => {

    try{
      if (req.session.user && req.session.user.role === 'owner'){
        loggedin = true
        let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
        res.render('gymbars/creategym',{loggedin,name:fname})
      }
      else{
        loggedin = false
        res.redirect('/login')
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
        loggedin = true
        let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
        res.render('gymbars/updategym',{id:id,values:values,loggedin,name:fname})
      }
      else if(req.session.user && req.session.user!=='owner')
        res.redirect('/gyms')
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
      if(req.session.user){
        loggedin = true
        let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
        let gymList = await gymData.getAllGyms();
      // res.render('gymbars/allgyms',{gyms:gymList}); // No need of new handlebar
      res.render('gymbars/gymlist',{gyms:gymList,loggedin,name:fname}); 
      }
      else{
        loggedin = false
        let gymList = await gymData.getAllGyms();
      // res.render('gymbars/allgyms',{gyms:gymList}); // No need of new handlebar
      res.render('gymbars/gymlist',{gyms:gymList,loggedin}); 
      }
      
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
    if(!req.session.user){
        
        res.redirect('/login')
        return
    }
      
     try{
      check2(gymName,location,phoneNumber,priceRange);
      if(!id) throw 'Pleaase provide an id';
      var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
      if(checkForHexRegExp.test(id)===false) throw 'Not a valid objectid';
      
    
      const updategym = await gymData.update(id,gymName,location,phoneNumber,priceRange)
      if(updategym)
        res.status(200).redirect('/gyms')
      else {
        if(req.session.user){
          loggedin = true
          let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
          res.status(500).render('gymbars/updategym', {title: "Error", error: 'Internal Server Error',loggedin,name:fname})
        }
        else{
          loggedin = false
          res.status(500).render('gymbars/updategym', {title: "Error", error: 'Internal Server Error',loggedin})
        }
          
      }
    }
    catch(e){
      if(req.session.user){
        loggedin = true
        let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
        const values = await gymData.getGym(id);
      res.status(400).render('gymbars/updategym', {id:id,values:values,title: "Error", error: e,loggedin,name:fname})
      }
      else{
        loggedin = false
        const values = await gymData.getGym(id);
      res.status(400).render('gymbars/updategym', {id:id,values:values,title: "Error", error: e,loggedin})
      }
      
    }
  });

router.post('/gymcreate',async(req,res) => {
  
  if(!req.session.user){
        
    res.redirect('/login')
    return
}
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
    if(req.session.user){
      loggedin = true
      let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
      res.status(500).render('gymbars/creategym', {title: "Error", error: 'Internal Server Error',loggedin,name:fname})
    }
    else{
      loggedin = false
      res.status(500).render('gymbars/creategym', {title: "Error", error: 'Internal Server Error',loggedin})
    }
       
       }
   }
   catch(e){
    if(req.session.user){
      loggedin = true
      let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
      res.status(400).render('gymbars/creategym', {title: "Error", error: e,loggedin,name:fname})
    }
    else{
      loggedin = false
      res.status(400).render('gymbars/creategym', {title: "Error", error: e,loggedin})
    }
       
       
    
   }

      
 
  });

  router.post('/search', async (req, res) => {
    
    
    try{

      if(req.session.user){
        loggedin = true
        let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName

        checkString(req.body.searchTerm)
      //if (!req.body.searchTerm) res.status(400).render('gymbars/emptysearch',{loggedin,name:fname})
      
    req.body.searchTerm = xss(req.body.searchTerm)
    req.body.searchTerm = req.body.searchTerm.trim()
    
      if (! req.body.searchTerm) 
      {
        res.json({error:'Kindly provide valid search term',status:400})
      }
      // res.status(400).render('gymbars/gymlist',{error:'Kindly provide valid search term',
      //                                           loggedin,name:fname})
      else{
        
        const marv = await gymData.search(req.body.searchTerm);
        if(marv.length < 1 || marv == undefined) 
        {
          res.json({error:`No results found for ${req.body.searchTerm}`,status:404})
        }
        // res.render('gymbars/gymlist',{error:`No results found for ${req.body.searchTerm}`,
        //                               loggedin,name:fname});
        else
        //Commenting below to use ajax instead
        //  res.render('gymbars/gymlist',{gyms:marv,loggedin,name:fname}); 
            {res.json({searchResult:marv})}
        }
        
      }
      else{
        loggedin = false

        checkString(req.body.searchTerm)
      //if (!req.body.searchTerm) res.status(400).render('gymbars/emptysearch',{loggedin})
      
    req.body.searchTerm = xss(req.body.searchTerm)
    req.body.searchTerm = req.body.searchTerm.trim()
    
      if (! req.body.searchTerm) {
        res.json({error:'Kindly provide valid search term',status:400})
      }
      //res.status(400).render('gymbars/gymlist',{error:'Kindly provide valid search term',loggedin})
      else{
        
        const marv = await gymData.search(req.body.searchTerm);
        if(marv.length < 1 || marv == undefined) {
          res.json({error:`No results found for ${req.body.searchTerm}`,status:404})
        }
        //res.render('gymbars/gymlist',{error:`No results found for ${req.body.searchTerm}`,loggedin});
        else
        //Commenting below to use ajax instead
        //  res.render('gymbars/gymlist',{gyms:marv,loggedin,name:fname}); 
        {res.json({searchResult:marv})}
        }
        
      }

      

    } catch (e) {
      res.json({error:e.message,status:e.status})
      // if(req.session.user){
      //   loggedin = true
      //   let id = req.session.user.id
        // userDetails = await userData.getUserById(id)
        // fname = userDetails.firstName
      //   let gymList = await gymData.getTopFive();
      // res.status(400).render('gymbars/gymlist', {gyms:gymList,title: "Error", error: e,loggedin,name:fname})
      // }
      // else{
      //   loggedin = false
      //   let gymList = await gymData.getTopFive();
      // res.status(400).render('gymbars/gymlist', {gyms:gymList,title: "Error", error: e,loggedin})
      // }
      
    }
  
  });

  // Added by Malay for gym filter
  function validateFilter(filter) {
    console.log(typeof(filter))
       if(typeof(filter) !== 'object') throw {status:400,message:'Object type expected'}
       if(  (filter.rating && typeof(filter.rating) !== 'string') ||
          ( filter.priceRange && typeof(filter.priceRange) !== 'string')
          
          ) throw {status:400,message:'String type expected'}

    filter.rating = xss(filter.rating)
    filter.priceRange = xss(filter.priceRange)

    filter.rating = filter.rating.trim()
    filter.priceRange = filter.priceRange.trim()

    // let tempRating = filter.rating
    // if(! /^[0-4]{1}$/.test(filter.rating)) throw {status:400,message:'Invalid Rating'}

    if( ( filter.rating ) && !( /^[0-4]{1}$/.test(filter.rating))) //4 because there will be 0-4 in select option
    {
      throw {status:400,message:'Invalid Rating'}
    }
    // filter.rating = parseInt(filter.rating)
    let priceRangeRegex = /^[$]{1,4}$/;
    if( ( filter.priceRange) && (! priceRangeRegex.test(filter.priceRange))) throw {
      status:400,
      message:'Invalid price Range'
    }
    return filter

  }
  


  router.post('/gfilter',async(req,res) => {
    console.log('Inside filter')
    try{
      let filter = validateFilter(req.body)
      
      let gymList = await gymData.getFilterData(filter)

      if(req.session.user){
        loggedin = true
        let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
        if(gymList){
        
          res.render('gymbars/gymlist',{gyms:gymList,loggedin,name:fname})
        }else{
          
          res.render('gymbars/gymlist',{error:`No Gyms found`,loggedin,name:fname})
        }
        
      }
      else{
        loggedin = false
        if(gymList){
        
          res.render('gymbars/gymlist',{gyms:gymList,loggedin})
        }else{
          
          res.render('gymbars/gymlist',{error:`No Gyms found`,loggedin})
        }
        
      }
    }catch(e){
      if(req.session.user){
        loggedin = true
        let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
        res.status(e.status || 500).render('gymbars/gymlist',{error:e.message,loggedin,name:fname})
      }
      else{
        loggedin = false
        // const values = await gymData.getGym(id); Malay: id field is not defined and its not used here
        res.status(e.status || 500).render('gymbars/gymlist',{error:e.message,loggedin})
      }
      
    }
    
  })

  /* router.get('/:id',async(req,res) => { //Keep this as the last route function
    try {
      const gym = await gymData.getGym(req.params.id)
      const reviews = await gymData.getReviews(req.params.id);
      const rating = await gymData.calcRating(req.params.id)
      gym._id = gym._id.toString()
      res.render('gymbars/gymprofile',{gym:gym,reviews:reviews,rate:rating})
      
    }
    catch(e){
      res.status(400).render('gymbars/gymprofile', {title: "Error", error: e})
    }
  
  });  */

  router.get('/:id',async(req,res) => {
    try {
      if(req.session.user && req.session.user.role === 'owner'){
      
      loggedin = true
      let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
      let userEmail = req.session.user.email;
      const gym = await gymData.getGymByOwner(req.params.id,userEmail);
      owner = gym[1];
      const reviews = await gymData.getReviews(req.params.id);
      const rating = await gymData.calcRating(req.params.id)
      res.render('gymbars/gymprofile',{gym:gym[0],reviews:reviews,rate:rating,owner:owner,loggedin,name:fname})
      }
      else if(req.session.user){
        loggedin = true
        let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        fname = userDetails.firstName
        const gym = await gymData.getGym(req.params.id);
        let owner = false;
        const reviews = await gymData.getReviews(req.params.id);
        const rating = await gymData.calcRating(req.params.id)
        res.render('gymbars/gymprofile',{gym:gym,reviews:reviews,rate:rating,owner:owner,loggedin,name:fname})
      }
      else{
        loggedin = false
        const gym = await gymData.getGym(req.params.id);
        let owner = false;
        const reviews = await gymData.getReviews(req.params.id);
        const rating = await gymData.calcRating(req.params.id)
        res.render('gymbars/gymprofile',{gym:gym,reviews:reviews,rate:rating,owner:owner,loggedin})
      }
    }
    catch(e){
      res.status(404).render('notFd',{title:'404- page not found'});
      // res.status(400).render('gymbars/gymprofile', {title: "Error", error: e})
    }
  
  });

module.exports = router;