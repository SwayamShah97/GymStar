//const { trainersData } = require('.');
const mongoCollections = require('../config/mongoCollections');
const trainers = mongoCollections.trainers;
const reviews = mongoCollections.reviews
const gyms = mongoCollections.gyms
const xss = require('xss');
const { ObjectId } = require('bson');

function validateTrainerReview(review){
    if( ! review.rating ||
        ! review.trainerId ||
        ! review.reviewText ||
        ! review.userId ||
        ! review.date ||
        ! review.reviewer
        ) throw {status:400,message:'Kindly provide all valid inputs'}

    review.rating = xss(review.rating)
    review.trainerId = xss(review.trainerId)
    review.reviewText = xss(review.reviewText)
    review.userId = xss(review.userId)
    review.date = xss(review.date)
    review.reviewer = xss(review.reviewer)

    review.rating = review.rating.trim()
    review.trainerId = review.trainerId.trim()
    review.reviewText = review.reviewText.trim()
    review.userId = review.userId.trim()
    review.date = review.date.trim()
    review.reviewer = review.reviewer.trim()

    if( ! parseInt(review.rating) ||
        parseInt(review.rating) < 0 ||
        parseInt(review.rating) > 5 
        // || parseInt(review.rating).isNaN()
         ) throw {status:400,message:'Invalid rating'}

    let objectIdRegex = /^[a-f\d]{24}$/i;
    if (!objectIdRegex.test(review.trainerId) || !ObjectId.isValid(review.trainerId))
    throw {status:400, message:"Invalid objectId for trainerId"};

    if(review.reviewText.length === 0) throw {status:400,message:'Kindly provide proper review.'}
    
    // if (!objectIdRegex.test(review.userId) || !ObjectId.isValid(review.userId))
    // throw {status:400, message:"Invalid objectId for UserId"};
    if(! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(review.userId)) throw {status:400, message:"Invalid objectId for UserId"};

    let dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
    if(! dateRegex.test(review.date)) throw {status:400,message:'Invalid Date format'}

    if(review.reviewer.length === 0 ) throw {status:400,message:'Invalid reviewer '}
    return review
}

module.exports = {
    async getGymByUsername(username){//here username is the name of gym owner
        const gymCollection = await gyms()
        const gymList = await gymCollection.find({'userName':username},
                                                {
                                                    projection:{"gymName":1,"_id":1}
                                                }).toArray()
        return gymList
    },
    async updateOverallRating(trainerId,gymId){
        const reviewCollection = await reviews()
        // const trainerReviews = await reviewCollection.find( {"trainerId" : trainerId , "gymId": gymId , "reviewType":'T'}
        //                                                  , {projection:{"rating": 1, "trainerId":1, "_id":0}}).toArray()
        trainerId = ObjectId(trainerId)
        const trainerReviews = await reviewCollection.find( {"trainerId" : trainerId }
                                                         , {projection:{"rating": 1, "trainerId":1, "_id":0}}).toArray()
        let ratLength = trainerReviews.length
        let ratSum = 0
        for (let j of trainerReviews) {

            ratSum+= parseInt(j.rating)
        }
        if(ratSum){
            const trainerCollection = await trainers()
            let insertedId = await trainerCollection.updateOne(
                // {trainerId:trainerId , gymId: gymId },
                {_id:trainerId },
                { $set : {overallRating: ratSum/ratLength} })
            if(insertedId.modifiedCount === 0 ) throw {status:500,message:'Unable to modify the overallRating'}
        }
        return true

    },
    
    async validateTrainerDetails(trainer){

        //XSS
        trainer.trainerFirstName  = xss(trainer.trainerFirstName )
        trainer.trainerLastName = xss(trainer.trainerLastName)
        trainer.gymId = xss(trainer.gymId)
        trainer.gender = xss(trainer.gender)
        trainer.phoneNo = xss(trainer.phoneNo)
        trainer.emailId = xss(trainer.emailId)
        trainer.experience = xss(trainer.experience)

        trainer.trainerFirstName  = trainer.trainerFirstName.trim()
        trainer.trainerLastName = trainer.trainerLastName.trim()
        trainer.gymId = trainer.gymId.trim()
        trainer.gender = trainer.gender.trim()
        trainer.phoneNo = trainer.phoneNo.trim()
        trainer.emailId = trainer.emailId.trim()
        trainer.experience = trainer.experience.trim()

        
        if(!trainer.trainerFirstName || 
        !trainer.trainerLastName || 
        !trainer.gymId ||
        !trainer.gender ||
        !trainer.phoneNo || 
        !trainer.experience || 
        !trainer.emailId) throw {status:400, message:'Kindly provide all the fields'}

        let spregex = /[^\w]/g
        let spaceRegex = /\s/g
        let numberRegex = /[0-9]/g
        if(spaceRegex.test(trainer.trainerFirstName) ||
            spregex.test(trainer.trainerFirstName) ||
            numberRegex.test(trainer.trainerFirstName)) throw  {status:400,message:'Invalid First Name'} 

        if(spaceRegex.test(trainer.trainerLastName) ||
            spregex.test(trainer.trainerLastName) ||
            numberRegex.test(trainer.trainerLastName)) throw  {status:400,message:'Invalid Last Name'} 
            
        if(!(trainer.gender === 'Male' || 
            trainer.gender === 'Female' || 
            trainer.gender === 'Other')) throw {status:400,message:'Invalid Gender'}

        
        let phoneNumberRegex = /^\d{10}$/; // Google: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/
        if (!phoneNumberRegex.test(trainer.phoneNo)) throw {status:400,message:'Invalid Number Format'}
        trainer.phoneNo = parseInt(trainer.phoneNo)

        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(! emailRegex.test(trainer.emailId) ) throw {status:400,message:'Invalid Email Address'}

        let numRegex = /^\d+$/
        if(! numRegex.test(trainer.experience)) throw {status:400,message:'Invalid experience'}
        if( parseInt(trainer.experience) < 0  || parseInt(trainer.experience) > 100 ) throw {status:400,message:'Kindly provide valid experience'}
        trainer.experience = parseInt(trainer.experience)

        
        let objectIdRegex = /^[a-f\d]{24}$/i;
        if (!objectIdRegex.test(trainer.gymId) || !ObjectId.isValid(trainer.gymId))
        throw {status:400, message:"Invalid objectId for GymId"};
        trainer.gymId = ObjectId(trainer.gymId)
    

        return trainer
    },
    async createTrainer(trainerDetails){
        trainerDetails = await this.validateTrainerDetails(trainerDetails)
        
        const trainerCollection = await trainers()
        const trainer = await trainerCollection.findOne({
            // "trainerId" : trainerDetails.trainerId,
            // "trainerFirstName":trainerDetails.trainerFirstName,
            // "trainerLastName":trainerDetails.trainerLastName,
            "emailId" : trainerDetails.emailId,
            "gymId":trainerDetails.gymId

        }) //This will allow to create trainers with same name in one gym
        if(trainer) throw {status:400, message:`${trainerDetails.firstname} ${trainerDetails.lastname} already exist in this gym`}
        let insertedId = await trainerCollection.insertOne(trainerDetails)
        if(insertedId.insertCount === 0) throw {status:500, message:`Unable to create trainer ${trainerDetails.trainerFirstName} ${trainerDetails.trainerLastName}`}
        return true


    },
    
    async createTrainerReview(review){
        review = validateTrainerReview(review)
        const reviewCollection = await reviews()
        //Do we want to allow multiple reviews from one user for one trainer? Or should we provide an option to modify it?
        //Assuming no restrictions
        review.trainerId = ObjectId(review.trainerId)
        let newReview = {
            reviewer : review.reviewer,
            trainerId : review.trainerId,
            userId : review.userId,
            date: review.date, //System Date can be open
            reviewText: review.reviewText,
            // reviewType: 'T',
            rating: review.rating

        }
        const insertedId = await reviewCollection.insertOne(newReview)
        if(insertedId.insertCount === 0) throw {status:500,message:'Something went wrong on server side. Unable to create a new review'}
        //Calculate overall Rating
        await this.updateOverallRating(review.trainerId, review.gymId)
        return true

    },
    getTodaysDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        return today
    },
    async getTrainersByGymId(gymId){
        if(! gymId ) throw{status:400,message:'Kindly provide gymId'}
        if(typeof(gymId) !== 'string' ) throw{status:400,message:'Kindly provide string gymId'}
        gymId = ObjectId(gymId)
        const trainerCollection = await trainers()
        const trainerList = await trainerCollection.find({'gymId':gymId} ).toArray()
        if(trainerList){
            for (let t of trainerList){
                t.gymId = t.gymId.toString()
                t._id = t._id.toString()
            }
            return trainerList
        }else{
            return false
        }
    },
    async getTrainersByTrainerId(trainerId){
        //To post trainer review from trainerList page
        trainerId = ObjectId(trainerId)
        const trainerCollection = await trainers()
        const trainerDetails =await trainerCollection.findOne({"_id":trainerId})
        if(trainerDetails){
            return trainerDetails
        }else{
            return false
        }

    }
}