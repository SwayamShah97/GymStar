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
        res.redirect('/gyms')
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
    //     res.status(400).render('login', {title: "Error", error: 'Password should not contain spaces'})
    //     return
    // }

    
    
    if(password.length <6) {
        res.status(400).render('login', {title: "Error", error: 'Password should atleast 6 character long'})
        return
    } 

    email = email.toLowerCase()

        
    try{
        const info = await userData.checkUser(email,password)
        
        
        // console.log(info)
        if(info.authenticated == true){
            req.session.user = {
                id:info.id,
                role:info.role,
                firstName:info.firstName,
                email:info.email
                
            }
            res.redirect('/gyms')
            // console.log(req.session.user)
            }
        else {
            res.status(500).render('login', {title: "Error", error: 'Internal Server Error'})
            }
        }
        catch(e){
            res.status(400).render('login', {title: "Error", error: e})
        }

});

// router.get('/private', async (req,res) => {

//     if(req.session.user){
//         res.render('private', {title: "Private Page", email:req.session.user.email})
//     }
//     else{
//         res.redirect('/login')
//     }
// });

router.get('/signup', async (req,res) => {
    if (req.session.user) {
        res.redirect('/gyms')
        return
    }
    else{
        res.render('signup', {title: "Signup Page"})
    }
    
});



router.post('/signup', async (req,res) => {

    if (req.session.user) {
        res.redirect('/gyms')
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

    if(!role || !email || !password || !firstName || !lastName || !gender || !city || !state || !mobile || !dob) {
        res.status(400).render('signup', {title: "Error", error: 'You must provide all details'})
        return
    } 

    if (typeof role != 'string' || typeof email != 'string' || typeof password != 'string' || typeof firstName != 'string' || typeof lastName != 'string' ||
    typeof city != 'string' || typeof state != 'string' || typeof gender != 'string' || typeof mobile != 'string' || 
    typeof dob != 'string') {
        res.status(400).render('signup', {title: "Error", error: 'Input should be string'})
        return
    } 

    if (!email.replace(/\s/g, '').length || !password.replace(/\s/g, '').length 
    || !firstName.replace(/\s/g, '').length || !lastName.replace(/\s/g, '').length
    || !role.replace(/\s/g, '').length || !city.replace(/\s/g, '').length
    || !state.replace(/\s/g, '').length || !mobile.replace(/\s/g, '').length
    || !gender.replace(/\s/g, '').length || !dob.replace(/\s/g, '').length) {
        res.status(400).render('signup', {title: "Error", error: 'Input cannot be empty spaces'})
        return
    } 

    let regMob = mobile.search(/^\d{10}$/);

    if(regMob=== -1){
        res.status(400).render('signup', {title: "Error", error:  'PhoneNumber not valid'})
        return 
    } 

    let regEmail = email.search(/^([a-zA-Z0-9_.+-]{1,})(@{1})([a-zA-Z]{1})([a-zA-Z0-9-]{1,})([.]{1})([a-zA-Z]{1,})$/gi);

    if (regEmail === -1) {
        res.status(400).render('signup', {title: "Error", error:  'Email format not valid'})
        return
    }
    
    // if (password.length != password.replace(/\s/g, '').length) {
    //     res.status(400).render('signup', {title: "Error", error: 'Password should not contain spaces'})
    //     return
    // }

    
    
    if(password.length <6) 
    {
        res.status(400).render('signup', {title: "Error", error: 'Password should atleast 6 character long'})
        return
    }

    if(role != 'user' && role != "owner") 
    {
        res.status(400).render('signup', {title: "Error", error: "Select valid role"})
        return
    } 

    if(city != "Jersey City" && city != "Hoboken") 
    {
        res.status(400).render('signup', {title: "Error", error: "Select valid city"})
        return
    } 
    
    if(state != "New Jersey" ) 
    {
        res.status(400).render('signup', {title: "Error", error: "Select valid state"})
        return
    } 

    if(gender != "male" && gender != "female") 
    {
        res.status(400).render('signup', {title: "Error", error: "Select valid Gender"})
        return
    } 
    
    // let regDob = dob.search(/^(19|20)\d\d[-]([1-9]|1[012])[-]([1-9]|[12][0-9]|3[01])$/)

    // if(regDob == -1) 
    // {
    //     res.status(400).render('signup', {title: "Error", error: 'Date of birth formate not valid'})
    //     return
    // } 
    
    email = email.toLowerCase()

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


router.get('/userprofile', async (req, res) => {
    
    if (!req.session.user) {
        res.redirect('/login')
    } else {
        let id = req.session.user.id
        userDetails = await userData.getUserById(id)
        
        userProfile = {
                id:userDetails.id,
                role:userDetails.role,
                firstName:userDetails.firstName,
                lastName:userDetails.lastName,
                email:userDetails.email,
                city:userDetails.city,
                state:userDetails.state,
                mobile:userDetails.mobile,
                gender:userDetails.gender,
                dob:userDetails.dob
        }
        res.render('userProfile', {title: "Profile", userProfile})
    }

});

router.post('/updateProfile', async (req,res) => {

    // if (!req.session.user) {
    //     res.redirect('/login')
    //     return
    // }
    let id = req.session.user.id
    let role = req.session.user.role
    let firstName = req.body.firstname
    let lastName = req.body.lastname
    let email = req.session.user.email
    let city = req.body.city
    let state = req.body.state
    let mobile = req.body.mobile
    let gender = req.body.gender
    let dob = req.body.dob
    let password = req.body.password
    
    // console.log( id)
    // console.log( role)
    // console.log( firstName)
    // console.log( lastName)
    // console.log( email)
    // console.log( city)
    // console.log( state)
    // console.log( mobile)
    // console.log( gender)
    // console.log( dob)
    // console.log( password)

    if( !role || !email || !password || !firstName || !lastName || !gender || !city || !state || !mobile || !dob) {
        res.status(400).render('userProfile', {title: "Error", error: 'You must provide all details 1'})
        return
    } 

    // if(typeof id !== 'string') throw 'Id should be string'
    // if(!mongodb.ObjectId.isValid(id)) throw 'Not a valid ObjectID'
        
    
    if (typeof role != 'string' || typeof email != 'string' ||  typeof password != 'string' || typeof firstName != 'string' || typeof lastName != 'string' ||
    typeof city != 'string' || typeof state != 'string' || typeof gender != 'string' || typeof mobile != 'string' || 
    typeof dob != 'string') {
        res.status(400).render('userProfile', {title: "Error", error: 'Input should be string'})
        return
    } 

    if (!email.replace(/\s/g, '').length  || !role.replace(/\s/g, '').length  || !password.replace(/\s/g, '').length 
    || !firstName.replace(/\s/g, '').length || !lastName.replace(/\s/g, '').length
    || !city.replace(/\s/g, '').length
    || !state.replace(/\s/g, '').length || !mobile.replace(/\s/g, '').length
    || !gender.replace(/\s/g, '').length || !dob.replace(/\s/g, '').length) {
        res.status(400).render('userProfile', {title: "Error", error: 'Input cannot be empty spaces'})
        return
    } 

    let regMob = mobile.search(/^\d{10}$/);

    if(regMob=== -1){
        res.status(400).render('userProfile', {title: "Error", error:  'PhoneNumber not valid'})
        return 
    } 

    let regEmail = email.search(/^([a-zA-Z0-9_.+-]{1,})(@{1})([a-zA-Z]{1})([a-zA-Z0-9-]{1,})([.]{1})([a-zA-Z]{1,})$/gi);

    if (regEmail === -1) {
        res.status(400).render('userProfile', {title: "Error", error:  'Email format not valid'})
        return
    }
    
    // if (password.length != password.replace(/\s/g, '').length) {
    //     res.status(400).render('signup', {title: "Error", error: 'Password should not contain spaces'})
    //     return
    // }

    
    
    if(password.length <6) 
    {
        res.status(400).render('userProfile', {title: "Error", error: 'Password should atleast 6 character long'})
        return
    }

    if(role != 'user' && role != "owner") 
    {
        res.status(400).render('signup', {title: "Error", error: "Select valid role"})
        return
    } 

    if(city != "Jersey City" && city != "Hoboken") 
    {
        res.status(400).render('userProfile', {title: "Error", error: "Select valid city"})
        return
    } 
    
    if(state != "New Jersey" ) 
    {
        res.status(400).render('userProfile', {title: "Error", error: "Select valid state"})
        return
    } 

    if(gender != "male" && gender != "female") 
    {
        res.status(400).render('userProfile', {title: "Error", error: "Select valid Gender"})
        return
    } 
    
    // let regDob = dob.search(/^(19|20)\d\d[-]([1-9]|1[012])[-]([1-9]|[12][0-9]|3[01])$/)

    // if(regDob == -1) 
    // {
    //     res.status(400).render('signup', {title: "Error", error: 'Date of birth formate not valid'})
    //     return
    // } 
    
     email = email.toLowerCase()

     

    try{
    
    const info = await userData.checkUser(email,password)
    if(info.authenticated == true){
    const updateInfo = await userData.updateUser(id,role,firstName,lastName,city,state,mobile,gender,dob, password)
    if(updateInfo.userUpdated == true){
        res.status(200).redirect('/userprofile')
        }
    else {
        res.status(500).render('userProfile', {title: "Error", error: 'Internal Server Error'})
        }
    }  
    else {
        res.status(500).render('userProfile', {title: "Error", error: 'Internal Server Error'})
        }
    
    }
    catch(e){
        userDetails = await userData.getUserById(id)
        userProfile = {
            id:userDetails.id,
            role:userDetails.role,
            firstName:userDetails.firstName,
            lastName:userDetails.lastName,
            email:userDetails.email,
            city:userDetails.city,
            state:userDetails.state,
            mobile:userDetails.mobile,
            gender:userDetails.gender,
            dob:userDetails.dob
        }
        res.status(400).render('userProfile', {title: "Error", error: e, userProfile})
        // res.status(200).redirect('/userprofile')
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


  module.exports = router;