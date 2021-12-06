const mongoCollections = require("../config/mongoCollections");
const createReview = mongoCollections.reviews;
let { ObjectId } = require('mongodb');


async function addReviewToGym(gymId, reviewerId, review, rating, reviewer){
    if(!gymId) throw "[Gym review data Error]:You need to provide the gym ID"
    if(!reviewerId) throw "[Gym review data Error]:You need to provide the reviewer ID"
    if(!review) throw "[Gym review data Error]:You must provide the review"
    if(!rating) throw "[Gym review data Error]:You need to provide the rating score"
    if(!reviewer) throw "[Gym review data Error]: You need to provide the reviewer name"


    if(typeof(gymId) !== 'string') throw "[Gym review data Error]:Wrong type of gym ID"
    if(typeof(reviewerId) !== 'string') throw "[Gym review data Error]:Wrong type of reviewer ID"
    if(typeof(review) !== 'string') throw "[Gym review data Error]:Wrong type of review"
    if(typeof(rating) !== 'number') throw "[Gym review data Error]:Wrong type of rating"
    if(typeof(reviewer) !== 'string') throw "[Gym review data Error]:Wrong type of reviewer name"

    //TODO: make sure that gymId and reviewerId type pass in is string
    if (!ObjectId.isValid(gymId)) throw "[Gym review data Error]:the invalid gym ObjectId"
    if (!ObjectId.isValid(reviewerId)) throw "[Gym review data Error]:the invalid reviewer ObjectId"

    if(review.trim().length ===0) throw "[Gym review data Error]:The review can not be all space"
    if(reviewer.trim().length === 0 ) throw "[Gym review data Error]:The reviewer can not be all space"
    
    if(rating >5 || rating < 1 ) throw "[Gym review data Error]:The rating is not vaild number"
    const timeNow  = new Date()
    const postDate = timeNow.toDateString()

    let newReview = {
        gymId: ObjectId(gymId),
        userId: ObjectId(reviewerId),
        date: postDate,
        reviewText: review,
        rating: rating,
        reviewer: reviewer
    }

    const reviewData = await createReview();
    const output = await reviewData.insertOne(newReview);
    return {addReviewtoTheGym: true};

}

async function addReviewToTrainer(trainerId, reviewerId, review, rating, reviewer){
    if(!trainerId) throw "[Trainer review data Error]:You need to provide the gym ID"
    if(!reviewerId) throw "[Trainer review data Error]:You need to provide the reviewer ID"
    if(!review) throw "[Trainer review data Error]:You must provide the review"
    if(!rating) throw "[Trainer review data Error]:You need to provide the rating score"
    if(!reviewer) throw "[Trainer review data Error]: You need to provide the reviewer name"



    if(typeof(trainerId) !== 'string') throw "[Trainer review data Error]:Wrong type of gym ID"
    if(typeof(reviewerId) !== 'string') throw "[Trainer review data Error]:Wrong type of reviewer ID"
    if(typeof(review) !== 'string') throw "[Trainer review data Error]:Wrong type of review"
    if(typeof(rating) !== 'number') throw "[Trainer review data Error]:Wrong type of rating"
    if(typeof(reviewer) !== 'string') throw "[Trainer review data Error]:Wrong type of reviewer name"


    //TODO: make sure that gymId and reviewerId type pass in is string
    if (!ObjectId.isValid(trainerId)) throw "[Trainer review data Error]:the invalid gym ObjectId"
    if (!ObjectId.isValid(reviewerId)) throw "[Trainer review data Error]:the invalid reviewer ObjectId"

    if(review.trim().length ===0) throw "[Trainer review data Error]:The review can not be all space"
    if(reviewer.trim().length === 0 ) throw "[Trainer review data Error]:The reviewer can not be all space"

    
    if(rating >5 || rating < 1 ) throw "[Trainer review data Error]:The rating is not vaild number"
    const timeNow  = new Date()
    const postDate = timeNow.toDateString()

    let newReview = {
        trainerId: trainerId,
        userId: reviewerId,
        date: postDate,
        reviewText: review,
        rating: rating,
        reviewer: reviewer
    }

    const reviewData = await createReview();
    const output = await reviewData.insertOne(newReview);
    return {addReviewtoTheTrainer: true};

}





module.exports = {
    addReviewToGym,
    addReviewToTrainer
}

