const mongoCollections = require('../config/mongoCollections');
const trainers = mongoCollections.trainers;
const reviews = mongoCollections.reviews
module.exports = {
    async updateOverallRating(trainerId,gymId){
        const reviewCollection = await reviews()
        const trainerReviews = await reviewCollection.find( {"trainerId" : trainerId , "gymId": gymId , "reviewType":'T'}
                                                         , {projection:{"rating": 1, "trainerId":1, "_id":0}}).toArray()
        let ratLength = trainerReviews.length
        let ratSum = 0
        for (let j of trainerReviews) {
            ratSum+= j.rating
        }
        if(ratSum){
            const trainerCollection = await trainers()
            let insertedId = await trainerCollection.updateOne(
                {trainerId:trainerId , gymId: gymId },
                { $set : {overallRating: ratSum/ratLength} })
            if(insertedId.modifiedCount === 0 ) throw {status:500,message:'Unable to modify the overallRating'}
        }
        return true

    },
    
    //Following function will be used in routes as well hence exporting
    async validateTrainerDetails(trainerDetails){

    },
    async createTrainer(trainerDetails){
        this.validateTrainerDetails(trainerDetails)
        
        const trainerCollection = await trainers()
        const trainer = await trainerCollection.findOne({
            "trainerId" : trainerDetails.trainerId,
            // "trainerFirstName":trainerDetails.trainerFirstName,
            // "trainerLastName":trainerDetails.trainerLastName,
            "gymId":trainerDetails.gymId

        }) //This will allow to create trainers with same name in one gym
        if(trainer) throw {status:400, message:`${trainerDetails.firstname} ${trainerDetails.lastname} already exist in this gym`}
        let insertedId = await trainerCollection.insertOne(trainerDetails)
        if(insertedId.insertCount === 0) throw {status:500, message:`Unable to create trainer ${trainerDetails.trainerFirstName} ${trainerDetails.trainerLastName}`}
        return true


    },
    async validateTrainerReview(review){

    },
    async createTrainerReview(review){
        this.validateTrainerReview(review)
        const reviewCollection = await reviews()
        //Do we want to allow multiple reviews from one user for one trainer? Or should we provide an option to modify it?
        //Assuming no restrictions
        let newReview = {
            gymId : review.gymId,
            trainerId : review.trainerId,
            userId : review.userId,
            date: review.date, //System Date can be open
            reviewText: review.reviewText,
            reviewType: 'T',
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
    }
}