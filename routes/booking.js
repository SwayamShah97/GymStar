const { ObjectId } = require('bson');
const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewDataInfo = data.addReview;
const bookDataInfo = data.addBooking;
const xss = require('xss');


router.get('/booking/:id', async(req,res) =>{
    if(req.session.user){
        loggedin = true
        fname = req.session.user.firstName
        let id = req.params;
    res.render('webs/booking',{message: "Make an appointment" , gymId:id,loggedin,name:fname})
      }
      else{
        loggedin = false
        res.redirect('/login')
    //     let id = req.params;
    // res.render('webs/booking',{message: "Make an appointment" , gymId:id,loggedin})
      }
    
});

router.post('/booking/:id', async (req, res) => {
    //userId = req.session.userId;
    //gymId = req.session.gymId;
    

    try{

        if(req.session.user){
            loggedin = true
            req.session.user.firstName = xss(req.session.user.firstName);
            fname = req.session.user.firstName;

            req.body.date = xss(req.body.date);
            date = req.body.date;

            req.body.time = xss(req.body.time);
            time = req.body.time;

            req.params.id = xss(req.params.id);
            gymId = req.params.id;

            req.session.user.id = xss(req.session.user.id);
            userId = req.session.user.id;
    
    
    

    if(!data){
        res.status(400).render('webs/booking', {dateNotProvide: true, message: "Make an appointment",loggedin,name:fname})
        return;
    }
    if(!time){
        res.status(400).render('webs/booking', {timeNotProvide: true, message: "Make an appointment",loggedin,name:fname})
        return;
    }

    if(typeof(date) !== "string"){
        res.status(400).render('webs/booking', {dateTypeWrong: true, message: "Make an appointment",loggedin,name:fname})
        return;
    }

    if(typeof(time) !== 'string'){
        res.status(400).render('webs/booking', {timeTypeWrong: true, message: "Make an appointment",loggedin,name:fname})
        return;
    }

    if(date.trim().length === 0){
        res.status(400).render('webs/booking', {dateAllWhiteSpace: true, message: "Make an appointment",loggedin,name:fname})
        return;

    }

    if(time.trim().length === 0){
        res.status(400).render('webs/booking', {timeAllWhiteSpace: true, message: "Make an appointment",loggedin,name:fname})
        return;
    }

    if(isNaN(+date.substring(0,2)) || isNaN(+date.substring(3,5))|| isNaN(+date.substring(6,10))){
        res.status(400).render('webs/booking', {notValidDate: true, message: "Make an appointment",loggedin,name:fname})
        return;
    }

    if(date.substring(0,2).trim().length === 0 ||date.substring(3,5).trim().length === 0|| date.substring(6,10).trim().length === 0 ){
        res.status(400).render('webs/booking', {dateIncudeWhiteSpace: true, message: "Make an appointment",loggedin,name:fname})
        return;
    }

    if(parseInt(date.substring(0,2)) > 12 || parseInt(date.substring(0,2)) < 0){
        res.status(400).render('webs/booking', {notValidDate: true, message: "Make an appointment",loggedin,name:fname})
        return;
    }

    if(parseInt(date.substring(3,5)) > 31 || parseInt(date.substring(0,2)) < 0){
        res.status(400).render('webs/booking', {notValidDate: true, message: "Make an appointment",loggedin,name:fname})
        return;
    }

    if(parseInt(date.substring(0,2)) === 2 && parseInt(date.substring(3,5)) > 28 ){
        res.status(400).render('webs/booking', {notValidDate: true, message: "Make an appointment",loggedin,name:fname})
        return;
    }

    if(parseInt(date.substring(0,2)) === 4 && parseInt(date.substring(3,5)) > 30 ){
        res.status(400).render('webs/booking', {notValidDate: true, message: "Make an appointment",loggedin,name:fname})
        return; 
    }

    if(parseInt(date.substring(0,2)) === 6 && parseInt(date.substring(3,5)) > 30 ){
        res.status(400).render('webs/booking', {notValidDate: true, message: "Make an appointment",loggedin,name:fname})
        return; 
    }

    if(parseInt(date.substring(0,2)) === 9 && parseInt(date.substring(3,5)) > 30 ){
        res.status(400).render('webs/booking', {notValidDate: true, message: "Make an appointment",loggedin,name:fname})
        return; 
    }

    if(parseInt(date.substring(0,2)) === 11 && parseInt(date.substring(3,5)) > 30 ){
        res.status(400).render('webs/booking', {notValidDate: true, message: "Make an appointment",loggedin,name:fname})
        return;   
    }

    if(time.length !== 5){
        res.status(400).render('webs/booking', {notValidTime: true, message: "Make an appointment",loggedin,name:fname})
        return;   
    }

    if(isNaN(+time.substring(0,2)) || isNaN(+time.substring(3,5))){
        res.status(400).render('webs/booking', {notValidTime: true, message: "Make an appointment",loggedin,name:fname})
        return;  
    }

    if(parseInt(time.substring(0,2)) > 24 || parseInt(time.substring(0,2)) < 0 ){
        res.status(400).render('webs/booking', {notValidTime: true, message: "Make an appointment",loggedin,name:fname})
        return;  
    }

    if(parseInt(time.substring(3,5)) > 60 || parseInt(time.substring(3,5)) < 0){
        res.status(400).render('webs/booking', {notValidTime: true, message: "Make an appointment",loggedin,name:fname})
        return;  
    }

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy; 
    if(Date.parse(date) < Date.parse(today)){
        res.status(400).render('webs/booking', {canNotBookingToday: true, message: "Make an appointment",loggedin,name:fname})
        return; 
    }

    const makeBooking = await bookDataInfo.createBookingOrder(gymId,userId,date,time);
        if(makeBooking.addNewOrder === true){
            res.render('webs/successBooked', {message: "Successful" ,loggedin,name:fname})
        }else{
            res.status(400).render('webs/booking', {bookFailed: true, message: "Make an appointment",loggedin,name:fname})
        }
            
          }
          else{
            loggedin = false
            res.redirect('/login')
          }

        
    }
    catch(e){
        res.status(400).json({ error: e });
    }


});

    
module.exports = router;
