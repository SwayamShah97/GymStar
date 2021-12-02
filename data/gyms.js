const mongoCollections = require('../config/mongoCollections');
const gyms = mongoCollections.gyms;
const reviews = mongoCollections.reviews;
let { ObjectId } = require('mongodb');



module.exports = {
async create(userName,gymName, location, phoneNumber, priceRange) {

    
    let overallRating = 0;
   
    


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
    //if (!id) throw 'You must provide an id to search for';
    //var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    //if(checkForHexRegExp.test(id)===false) throw 'Not a valid objectid';
    id = ObjectId(id);
    const gymsCollection = await gyms();
    const res= await gymsCollection.findOne({ _id: id });
    if (res === null) throw 'No restaurant with that id';
    //res._id = res._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
    return res;
  },
  
  async getAllGyms() {
    const gymsCollection = await gyms();

    const res = await gymsCollection.find({}).toArray();
   /*  for(i=0;i<res.length;i++){
      res[i]._id = res[i]._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
    } */
    hpCharacters = await res;
    return hpCharacters;
  },

  async getReviews(id) {
    const reviewCollection = await reviews();
   
    id = ObjectId(id)
    
   /*
    console.log(id)
    const ret = await reviewCollection.findOne({gymId:id})
    console.log(ret) */
    const ret = await reviewCollection.find({gymId:id}).toArray();
   return ret
  },

  async getTopFive(){
    const gymsCollection = await gyms();
    const res = await gymsCollection.find().sort( { overallRating: -1 } ).limit(5).toArray();
    return res
  },

  async calcRating(id){
    const reviewCollection = await reviews();
    id = ObjectId(id);
    const ret = await reviewCollection.find({gymId:id}).toArray();
    let arr = []
    for (i in ret){
      arr.push(ret[i].rating)
    }
    let sum = arr.reduce((a,b)=>a+b)
    overallRating = sum/arr.length; 
    return overallRating
  },

  async search(searchTerm){
    if(!searchTerm) throw 'Search cannot be empty';
    const gymsCollection = await gyms();
    await gymsCollection.createIndex( { gymName: "text", location: "text" } )
    const ret = await gymsCollection.find( { $text: { $search: searchTerm } } ).toArray()
    return ret

  }

  
};

