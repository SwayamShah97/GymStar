const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

let mongodb = require('mongodb');
const bcrypt = require('bcryptjs');

const saltRounds = 12;


async function createUser(role,firstName,lastName,email,city,state,mobile,gender,dob, password){

    if(!role || !email || !password || !firstName || !lastName || !gender || !city || !state || !mobile || !dob) throw 'You must provide all details'

    if (typeof role != 'string' || typeof email != 'string' || typeof password != 'string' || typeof firstName != 'string' || typeof lastName != 'string' ||
    typeof city != 'string' || typeof state != 'string' || typeof gender != 'string' || typeof mobile != 'string' || 
    typeof dob != 'string') throw 'Input should be string'


    if (!email.replace(/\s/g, '').length || !password.replace(/\s/g, '').length 
        || !firstName.replace(/\s/g, '').length || !lastName.replace(/\s/g, '').length
        || !role.replace(/\s/g, '').length || !city.replace(/\s/g, '').length
        || !state.replace(/\s/g, '').length || !mobile.replace(/\s/g, '').length
        || !gender.replace(/\s/g, '').length || !dob.replace(/\s/g, '').length) throw 'Input cannot be empty spaces'

    // if (password.length != password.replace(/\s/g, '').length) throw'Password should not contain spaces'

        let regMob = mobile.search(/^\d{10}$/);

        if(regMob=== -1) throw 'PhoneNumber not valid'

        let regEmail = email.search(/^([a-zA-Z0-9_.+-]{1,})(@{1})([a-zA-Z]{1})([a-zA-Z0-9-]{1,})([.]{1})([a-zA-Z]{1,})$/gi);

        if (regEmail === -1) throw 'Email not valid'


    
    if(password.length <6) throw 'Password should atleast 6 character long'

    if(role != 'user' && role != "owner") throw "Select valid role"

    if(city != "Jersey City" && city != "Hoboken") throw "Select valid city"
    
    if(state != "New Jersey" ) throw "Select valid state"

    if(gender != "male" && gender != "female") throw "Select valid Gender"
    
    // let regDob = dob.search(/^(19|20)\d\d[-]([1-9]|1[012])[-]([1-9]|[12][0-9]|3[01])$/)

    // if(regDob == -1) throw 'Date of birth formate not valid'


    email = email.toLowerCase()

    let hash = await bcrypt.hash(password,saltRounds)

    const user = await users();

    let newUser = {
        role:role,
        firstName:firstName,
        lastName:lastName,
        email:email,
        city:city,
        state:state,
        mobile:mobile,
        gender:gender,
        dob:dob,
        password:hash
    }

    let findUser = await user.findOne({email:email})
    if(findUser != null) throw 'Email already exists'
    
    let insertInfo = await user.insertOne(newUser)
    if (insertInfo.insertedCount === 0) throw 'Could not add user'

    let obj ={
        userInserted:true
    }
    return obj
}

async function checkUser(email, password){

    if(!email || !password) throw 'You must provide all details'

    if (typeof email != 'string' || typeof password != 'string') throw 'Input should be string'

    if (!email.replace(/\s/g, '').length || !password.replace(/\s/g, '').length) throw 'Input cannot be empty spaces'

    // if (password.length != password.replace(/\s/g, '').length) throw'Password should not contain spaces'

    let regEmail = email.search(/^([a-zA-Z0-9_.+-]{1,})(@{1})([a-zA-Z]{1})([a-zA-Z0-9-]{1,})([.]{1})([a-zA-Z]{1,})$/gi);
    if(regEmail === -1) throw"Email format not valid"

    if(password.length <6) throw 'Password should atleast 6 character long'

    email = email.toLowerCase()

    

    const user = await users();

    let findUser = await user.findOne({email: email})
    if(findUser === null) throw 'No user with that Email'

    let passHash = findUser.password 

    let compareToMatch = false
    compareToMatch = await bcrypt.compare(password, passHash);
    
     
    findUser['_id'] = findUser['_id'].toString()
    
    if(compareToMatch){
        let obj ={
            authenticated:true,
            id:findUser._id,
            role:findUser.role,
            firstName:findUser.firstName,
            lastName:findUser.lastName,
            email:findUser.email,
            city:findUser.city,
            state:findUser.state,
            mobile:findUser.mobile,
            gender:findUser.gender,
            dob:findUser.dob
        }
        return obj
    }
    else {
        throw 'Either the username or password is invalid'
    }
}

module.exports={
    createUser,
    checkUser
}