const mongoCollections = require('../config/mongoCollections');
const gyms = mongoCollections.gyms;
const reviews = mongoCollections.reviews;
let { ObjectId } = require('mongodb');
const xss = require('xss');

function checkString(string){
  if(typeof(string) !== 'string') throw 'Input provided is not a string';
  if(string.trim().length === 0) throw 'Empty string on input';
}

function check(userName,gymName,location,phoneNumber,priceRange){
  if(!userName) throw 'You must provide a username to add gym';
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
  if (regEmail === -1) throw 'Username is not valid'
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
  // Added by Malay for gym filter
  function validateFilter(filter) {
    if(filter.rating){
      filter.rating = xss(filter.rating)
      filter.rating = filter.rating.trim()
    }
    if(filter.priceRange){
      filter.priceRange = xss(filter.priceRange)
      filter.priceRange = filter.priceRange.trim()
    }
    

    // if(! /^[1-5]{1}$/.test(filter.rating)) throw {status:400,message:'Invalid Rating'}
    if( filter.rating && !( /^[1-5]{1}$/.test(filter.rating))) //4 because there will be 0-4 in select option
    {
      throw {status:400,message:'Invalid Rating'}
    }
    filter.rating = parseInt(filter.rating)
    let priceRangeRegex = /^[$]{1,4}$/;
    if(filter.priceRange && (! priceRangeRegex.test(filter.priceRange))) throw {
      status:400,
      message:'Invalid price Range'
    }
    return filter

  }

module.exports = {
async create(userName,gymName, location, phoneNumber, priceRange) {

    
    let overallRating = 0;
    check(userName,gymName,location,phoneNumber,priceRange);
    userName = xss(userName);
    gymName = xss(gymName);
    location = xss(location);
    phoneNumber = xss(phoneNumber);
    priceRange = xss(priceRange);
    
    const gymsCollection = await gyms();
   
    let newGym = {
      userName: userName,
      gymName: gymName,
      location:location,
      phoneNumber: phoneNumber,
      priceRange:priceRange,
      overallRating:overallRating

    };

    const insertInfo = await gymsCollection.insertOne(newGym);
    if (insertInfo.insertedCount === 0) throw 'Could not add gym';
    let newId = insertInfo.insertedId;
    newId = ObjectId(newId).toString();
    const res = await this.getGym(newId);
    return res;
    
  },

  async getGym(id) {
    if (!id) throw 'You must provide an id to search for';
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if(checkForHexRegExp.test(id)===false) throw 'Not a valid objectid';
    id = ObjectId(id);
    
    const gymsCollection = await gyms();
    const res= await gymsCollection.findOne({ _id: id });
    if (res === null) throw 'No gym with that id';
    return res;
  },

  async getGymByOwner(id,userEmail) {
    
    if (!id) throw 'You must provide an id to search for';
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if(checkForHexRegExp.test(id)===false) throw 'Not a valid objectid';
    id = ObjectId(id);
    const gymsCollection = await gyms();
    const res= await gymsCollection.findOne({ _id: id });
    if (res === null) throw 'No gym with that id';
    console.log(res.userName)
    if(res.userName === userEmail){
      return [res,true]
    }
    else{
      return [res,false];
    }
    //res._id = res._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
    
  },

  
  
  async getGymWithUser(user) {
    if(!userName) throw 'You must provide a username';
    let regEmail = user.search(/^([a-zA-Z0-9_.+-]{1,})(@{1})([a-zA-Z]{1})([a-zA-Z0-9-]{1,})([.]{1})([a-zA-Z]{1,})$/gi);
    if (regEmail === -1) throw 'Username not valid'
    const gymsCollection = await gyms();
    const res= await gymsCollection.findOne({ userName: user });
    if (res === null) throw 'No gym with that username';
    return res;
  },

  async getAllGyms() {
    const gymsCollection = await gyms();
    const res = await gymsCollection.find({}).toArray();    
    return res;
  },

  async getReviews(id) {
    if (!id) throw 'You must provide an id to search for';
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if(checkForHexRegExp.test(id)===false) throw 'Not a valid objectid';
    id = ObjectId(id);
    const reviewCollection = await reviews();
    const ret = await reviewCollection.find({gymId:id}).toArray();
   return ret
  },

  async getTopFive(){
    const gymsCollection = await gyms();
    const res = await gymsCollection.find().sort( { overallRating: -1 } ).toArray();
    return res
  },

  async calcRating(id){
    if (!id) throw 'You must provide an id to search for';
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if(checkForHexRegExp.test(id)===false) throw 'Not a valid objectid';
    id = ObjectId(id);
    const reviewCollection = await reviews();
    const ret = await reviewCollection.find({gymId:id}).toArray();
    if(ret.length < 1 || ret == undefined) return 'No reviews for this gym yet'
    else{
      let arr = []
      for (i in ret){
        arr.push(ret[i].rating)
      }
      let sum = arr.reduce((a,b)=>a+b)
      overallRating = sum/arr.length; 
      return overallRating
    }
  },

  async search(searchTerm){
    if(!searchTerm) throw 'Search cannot be empty';
    checkString(searchTerm)
    const gymsCollection = await gyms();
    await gymsCollection.createIndex( { gymName: "text", location: "text" } )
    // const ret = await gymsCollection.find( { $text: { $search: searchTerm } } ).toArray()
    // Added by Malay on 2 Dec 2021 to search gyms from it's partial name
    let search_str = `/${searchTerm}/i`
    // const ret = await gymsCollection.find( { "gymName" :{ $regex : new RegExp(searchTerm, "i") } } ).toArray()
    const ret = await gymsCollection.find( {$or : [ 
      { "gymName" :{ $regex : new RegExp(searchTerm, "i") } },
      { "location" :{ $regex : new RegExp(searchTerm, "i") } }

     ]} ).toArray()
    // End of changes by Malay on 2D ec 2021
    return ret

  },

  async getFilterData(filter){
    // filter = validateFilter(filter)

    const gymsCollection = await gyms();
    const gymList = await gymsCollection.find(
      {
        $or : [
          { "overallRating" :  3 }, //{ $gte : filter.rating } },
          { "priceRange" :  '$$$' }//filter.priceRange}

        ]

      }

    ).toArray()
    if(gymList){
      return gymList
    }else{
      return 0
    }

  },
  async getId(gymName){
    checkString(gymName)
    const gymsCollection = await gyms();
    const ret = await gymsCollection.findOne({gymName:gymName});

    const res = await gymsCollection.findOne({ _id: ret._id });
    return res._id
  },

  async update (id,gymName, location, phoneNumber, priceRange)  {
    
    check2(gymName, location, phoneNumber,priceRange)
    if(!id) throw 'There is no record with that id';
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if(checkForHexRegExp.test(id)===false) throw 'Not a valid objectid';
    id = ObjectId(id); 
  
    
    const gymsCollection = await gyms();
    
    var query = { _id : id };
    var data = { $set : {gymName : gymName, location: location, phoneNumber: phoneNumber, priceRange : priceRange} } ;
    const updatedInfo = await gymsCollection.updateOne(
      query,data
    );
    if (updatedInfo.modifiedCount === 0) {
      
      throw 'could not update gym successfully';
    } 
    else{
      return 'Updated Successfully'
    }
  } 


  
};

