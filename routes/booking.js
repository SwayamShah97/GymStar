const { ObjectId } = require('bson');
const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewDataInfo = data.addReview;
const bookDataInfo = data.addBooking;

router.get('/booking', async(req,res) =>{
    res.render('webs/booking',{name: "Add review to Gym" })
});

router.post('/booking', async (req, res) => {
    //userId = req.session.userId;
    //gymId = req.session.gymId;
    date = req.body.date;
    time = req.body.time;
    console.log(req.body)


    if(!data){
        res.status(400).render('webs/booking', {dateNotProvide: true, name: "Make an appointment"})
        return;
    }
    if(!time){
        res.status(400).render('webs/booking', {timeNotProvide: true, name: "Make an appointment"})
        return;
    }

    if(typeof(date) !== "string"){
        res.status(400).render('webs/booking', {dateTypeWrong: true, name: "Make an appointment"})
        return;
    }

    if(typeof(time) !== 'string'){
        res.status(400).render('webs/booking', {timeTypeWrong: true, name: "Make an appointment"})
        return;
    }

    if(date.trim().length === 0){
        res.status(400).render('webs/booking', {dateAllWhiteSpace: true, name: "Make an appointment"})
        return;

    }

    if(time.trim().length === 0){
        res.status(400).render('webs/booking', {timeAllWhiteSpace: true, name: "Make an appointment"})
        return;
    }

    if(isNaN(+date.substring(0,2)) || isNaN(+date.substring(3,5))|| isNaN(+date.substring(6,10))){
        res.status(400).render('webs/booking', {notValidDate: true, name: "Make an appointment"})
        return;
    }

    if(date.substring(0,2).trim().length === 0 ||date.substring(3,5).trim().length === 0|| date.substring(6,10).trim().length === 0 ){
        res.status(400).render('webs/booking', {dateIncudeWhiteSpace: true, name: "Make an appointment"})
        return;
    }

    if(parseInt(date.substring(0,2)) > 12 || parseInt(date.substring(0,2)) < 0){
        res.status(400).render('webs/booking', {notValidDate: true, name: "Make an appointment"})
        return;
    }

    if(parseInt(date.substring(3,5)) > 31 || parseInt(date.substring(0,2)) < 0){
        res.status(400).render('webs/booking', {notValidDate: true, name: "Make an appointment"})
        return;
    }

    if(parseInt(date.substring(0,2)) === 2 && parseInt(date.substring(3,5)) > 28 ){
        res.status(400).render('webs/booking', {notValidDate: true, name: "Make an appointment"})
        return;
    }

    if(parseInt(date.substring(0,2)) === 4 && parseInt(date.substring(3,5)) > 30 ){
        res.status(400).render('webs/booking', {notValidDate: true, name: "Make an appointment"})
        return; 
    }

    if(parseInt(date.substring(0,2)) === 6 && parseInt(date.substring(3,5)) > 30 ){
        res.status(400).render('webs/booking', {notValidDate: true, name: "Make an appointment"})
        return; 
    }

    if(parseInt(date.substring(0,2)) === 9 && parseInt(date.substring(3,5)) > 30 ){
        res.status(400).render('webs/booking', {notValidDate: true, name: "Make an appointment"})
        return; 
    }

    if(parseInt(date.substring(0,2)) === 11 && parseInt(date.substring(3,5)) > 30 ){
        res.status(400).render('webs/booking', {notValidDate: true, name: "Make an appointment"})
        return;   
    }

    if(time.length !== 5){
        res.status(400).render('webs/booking', {notValidTime: true, name: "Make an appointment"})
        return;   
    }

    if(isNaN(+time.substring(0,2)) || isNaN(+time.substring(3,5))){
        res.status(400).render('webs/booking', {notValidTime: true, name: "Make an appointment"})
        return;  
    }

    if(parseInt(time.substring(0,2)) > 24 || parseInt(time.substring(0,2)) < 0 ){
        res.status(400).render('webs/booking', {notValidTime: true, name: "Make an appointment"})
        return;  
    }

    if(parseInt(time.substring(3,5)) > 60 || parseInt(time.substring(3,5)) < 0){
        res.status(400).render('webs/booking', {notValidTime: true, name: "Make an appointment"})
        return;  
    }

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy; 
    if(Date.parse(date) < Date.parse(today)){
        res.status(400).render('webs/booking', {canNotBookingToday: true, name: "Make an appointment"})
        return; 
    }
    //TEST CODE
    gymId = "61a67874028fbaa20828bf7a"
    userId = "61a67882028fbaa20828bf7b"
    try{
        const makeBooking = await bookDataInfo.createBookingOrder(gymId,userId,date,time);
        if(makeBooking.addNewOrder === true){
            res.render('webs/successBooked', {name: "Successful" })
        }else{
            res.status(400).render('webs/booking', {bookFailed: true, name: "Make an appointment"})
        }
    }
    catch(e){
        res.status(400).json({ error: e });
    }


});

    
module.exports = router;
