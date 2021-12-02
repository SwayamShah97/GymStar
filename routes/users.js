const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const userData = require("../data").userData;

router.get('/', async (req, res) => {
    
    // if (req.session.user) {
    //     res.redirect('/private')
    // } else {
        res.render('landing', {title: "GymStar"})
    // }

});

router.get('/login', async (req, res) => {
    
    if (req.session.user) {
        res.redirect('/private')
    } else {
        res.render('login', {title: "Login"})
    }

});

router.post('/login', async (req, res) => {

    if (req.session.user) {
        res.redirect('/private') 
        return
    }

    let email = req.body.email
    let password = req.body.password

    if(!email || !password) {
        res.status(400).render('login', {title: "Error", error: 'You must provide all details'})
        return
    } 

    if (typeof email != 'string' || typeof password != 'string') {
        res.status(400).render('login', {title: "Error", error: 'Input should be string'})
        return
    } 

    if (!email.replace(/\s/g, '').length || !password.replace(/\s/g, '').length) {
        res.status(400).render('login', {title: "Error", error: 'Input cannot be empty spaces'})
        return
    } 

    let regEmail = email.search(/^([a-zA-Z0-9_.+-]{1,})(@{1})([a-zA-Z]{1})([a-zA-Z0-9-]{1,})([.]{1})([a-zA-Z]{1,})$/gi);

    if (regEmail === -1) {
        res.status(400).render('login', {title: "Error", error:  'Email format not valid'})
        return
    }
    
    // if (password.length != password.replace(/\s/g, '').length) {
    //     res.status(400).render('signup', {title: "Error", error: 'Password should not contain spaces'})
    //     return
    // }

    
    
    if(password.length <6) {
        res.status(400).render('signup', {title: "Error", error: 'Password should atleast 6 character long'})
        return
    } 

    email = email.toLowerCase()

        
    try{
        const info = await userData.checkUser(email,password)
        
        if(info.authenticated == true){
            req.session.user = {
                role:info.role,
                firstName:info.firstName,
                lastName:info.lastName,
                email:info.email,
                city:info.city,
                state:info.state,
                mobile:info.mobile,
                gender:info.gender,
                dob:info.dob
                //By Malay on Dec 01, 2021
                //role: owner or user
            }
            res.redirect('/private')
            console.log(req.session.user)
            }
        else {
            res.status(500).render('login', {title: "Error", error: 'Internal Server Error'})
            }
        }
        catch(e){
            res.status(400).render('login', {title: "Error", error: e})
        }

});

router.get('/private', async (req,res) => {

    if(req.session.user){
        res.render('private', {title: "Private Page", email:req.session.user.email})
    }
    else{
        res.redirect('/login')
    }
});

router.get('/signup', async (req,res) => {
    if (req.session.user) {
        res.redirect('/private')
        return
    }
    else{
        res.render('signup', {title: "Signup Page"})
    }
    
});


router.post('/signup', async (req,res) => {

    if (req.session.user) {
        res.redirect('/private')
        return
    }

    let role = req.body.role
    let firstName = req.body.firstname
    let lastName = req.body.lastname
    let email = req.body.email
    let city = req.body.city
    let state = req.body.state
    let mobile = req.body.mobile
    let gender = req.body.gender
    let dob = req.body.dob
    let password = req.body.password
    // console.log(typeof role)
    // console.log(typeof firstName)
    // console.log(typeof lastName)
    // console.log(typeof email)
    // console.log(typeof city)
    // console.log(typeof state)
    // console.log(typeof mobile)
    // console.log(typeof gender)
    // console.log(typeof dob)
    // console.log(typeof password)


    

    try{
    const info = await userData.createUser(role,firstName,lastName,email,city,state,mobile,gender,dob, password)

    if(info.userInserted == true){
        res.status(200).redirect('/login')
        }
    else {
        res.status(500).render('signup', {title: "Error", error: 'Internal Server Error'})
        }
    }
    catch(e){
        res.status(400).render('signup', {title: "Error", error: e})
    }
    
    
});


router.get('/logout', async (req,res) => {
    
    if (!req.session.user) {
        res.redirect('/')
        return
    }

    req.session.destroy();
    res.render('logout',{title:'Logged Out'})
    
});


router.get('/gymcreate',async(req,res) => {

    try{
      res.render('gymbars/creategym')
    }
    catch(e){
      res.sendStatus(500);
    }
  });

  module.exports = router;