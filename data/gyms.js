const mongoCollections = require('../config/mongoCollections');
const gyms = mongoCollections.gyms;
const reviews = mongoCollections.reviews;
let { ObjectId } = require('mongodb');
const xss = require('xss');

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
    if (res === null) throw 'No gym with that id';
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

  }

  
};

