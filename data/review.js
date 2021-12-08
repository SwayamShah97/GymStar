const mongoCollections = require("../config/mongoCollections");
const createReview = mongoCollections.reviews;
let { ObjectId } = require('mongodb');


async function addReviewToGym(gymId, reviewerId, review, rating, reviewer){
    if(!gymId) throw "[Gym review data Error]:You need to provide the gym ID"
    if(!reviewerId) throw "[Gym review data Error]:You need to provide the reviewer ID"
    if(!review) throw "[Gym review data Error]:You must provide the review"
    if(!rating) throw "[Gym review data Error]:You need to provide the rating score"
    if(!reviewer) throw "[Gym review data Error]: You need to provide the reviewer name"


    // if(typeof(gymId) !== 'string') throw "[Gym review data Error]:Wrong type of gym ID"
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

async function remove(reviewId, gymId, userId) {

    if (!reviewId) throw '[Gym delete data Error]: Order Id parameter must be supplied';
    if (!gymId) throw '[Gym delete data Error]: Gym Id parameter must be supplied';
    if (!userId) throw '[Gym delete data Error]: User Id parameter must be supplied';


    if (typeof reviewId !== 'string') throw "[Gym delete data Error]: Order Id must be a string";
    if (typeof gymId !== 'string') throw "[Gym delete data Error]: Gym Id must be a string";
    if (typeof userId !== 'string') throw "[Gym delete data Error]: User Id must be a string";

    if (!ObjectId.isValid(reviewId)) throw "[Gym delete data Error]: the invalid review ObjectId"
    if (!ObjectId.isValid(gymId)) throw "[Gym delete data Error]: the invalid gym ObjectId"
    if (!ObjectId.isValid(userId)) throw "[Gym delete data Error]: the invalid user ObjectId"

    const reviewData = await createReview();


    const search = await reviewData.findOne({ _id: ObjectId(reviewId), gymId:ObjectId(gymId), userId:ObjectId(userId)});
    if(search ===null) throw("[Gym delete data Error]: there is no data fit this ID")

    const deletionInfo = await reviewData.deleteOne({ _id: ObjectId(reviewId), gymId:ObjectId(gymId), userId:ObjectId(userId)});

    if (deletionInfo.deletedCount === 0) {
        throw `[Gym delete data Error]: Could not delete restaurant with id of ${reviewId}`;
    }

    return {deleted: true};

}


//Work in process

async function update(reviewId, gymId, userId,review, rating){
    if(!reviewId) throw "[Gym update data Error]:You need to provide the review ID"
    if (!gymId) throw '[Gym update data Error]: Gym Id parameter must be supplied'
    if (!userId) throw '[Gym update data Error]: User Id parameter must be supplied'
    if(!review) throw "[Gym update data Error]:You must provide the review"
    if(!rating) throw "[Gym update data Error]:You need to provide the rating score"


    if(typeof(reviewId) !== 'string') throw "[Gym update data Error]:Wrong type of review ID"
    if(typeof(review) !== 'string') throw "[Gym update data Error]:Wrong type of review"
    if(typeof(rating) !== 'number') throw "[Gym update data Error]:Wrong type of rating"
    if (typeof (gymId) !== 'string') throw "[Gym update data Error]: Gym Id must be a string"
    if (typeof (userId) !== 'string') throw "[Gym update data Error]: User Id must be a string"

    //TODO: make sure that gymId and reviewerId type pass in is string
    if (!ObjectId.isValid(reviewId)) throw "[Gym update data Error]:the invalid gym ObjectId"
    if (!ObjectId.isValid(gymId)) throw "[Gym update data Error]: the invalid gym ObjectId"
    if (!ObjectId.isValid(userId)) throw "[Gym update data Error]: the invalid user ObjectId"


    if(review.trim().length ===0) throw "[Gym update data Error]:The review can not be all space"

    if(rating >5 || rating < 1 ) throw "[Gym update data Error]:The rating is not vaild number"

    const updateReview = await createReview();
    const Find = await updateReview.findOne({ _id: ObjectId(reviewId), gymId:ObjectId(gymId), userId:ObjectId(userId)});
    if(Find === null) throw "[Gym update data Error]: Can not find the review";
    const newReview = {
        reviewText: review,
        rating: rating
    }
    const updateInfo = await updateReview.updateOne({_id: ObjectId(reviewId)}, {$set: newReview})
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount )throw '[Gym update data Error]: Update failed'
    if(updateInfo.matchedCount === 0) throw "[Gym update data Error]: The input information is already exists"

    return {updateSuccess: true};


}


async function getAllReviewByGymID(gymId){
    if (!gymId) throw '[Review findByGymId Error]: Id parameter must be supplied';

    if (typeof gymId !== 'string') throw "[Review findByGymId Error]: Id must be a string";

    if (gymId.trim().length === 0) throw "[Review findByGymId Error]: the Gym id include all space"

    if (!ObjectId.isValid(gymId)) throw "[Review findByGymId Error]: the invalid ObjectId"

    const ReviewList = await createReview();

    const search = await ReviewList.find({ gymId: ObjectId(gymId) });

    if (search === null) throw "[Review findByGymId Error]: no restaurant fit with this id";


    return search;

}

async function getAllReviewByUserID(userId){
    if (!userId) throw '[Review findByUserId Error]: Id parameter must be supplied';

    if (typeof userId !== 'string') throw "[Review findByUserId Error]: Id must be a string";

    if (userId.trim().length === 0) throw "[Review findByUserId Error]: the User id include all space"

    if (!ObjectId.isValid(userId)) throw "[Review findByUserId Error]: the invalid ObjectId"

    const OrderList = await createOrder();

    const search = await OrderList.find({ userId: ObjectId(userId)});

    if (search === null) throw "[Review findByUserId Error]: no restaurant fit with this id";


    return search;

}





module.exports = {
    addReviewToGym,
    remove,
    update
}

