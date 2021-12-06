const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewDataInfo = data.addReview;



router.get('/addReviewToGym', async(req,res) =>{
    res.render('webs/addReviewToGym',{name: "Add review to Gym" })
});



router.post('/addReviewToGym', async (req, res) => {
    review = req.body.review;
    rating = req.body.rating;
    //add user Id , gym id and  reviewer name later in merge code 
    //userId = req.seesion.user;
    //reviewer = req.session.user;


    if(!review){
        res.status(400).render('webs/addReviewToGym', {ReviewNotProvide: true, name: "Add Your comment"})
        return;
    }
    if(typeof(review)!== 'string'){
        res.status(400).render('webs/addReviewToGym', {reviewTypeWrong: true, name: "Add Your comment"})
        return;

    }
    if(review.trim().length === 0){
        res.status(400).render('webs/addReviewToGym', {reviewSapce: true, name: "Add Your comment"})
        return;
    }
    if(!rating){
        res.status(400).render('webs/addReviewToGym', {ratingNotProvide: true, name: "Add Your comment"})
        return;
    }
    if(typeof(rating)!== 'string' ){
        res.status(400).render('webs/addReviewToGym', {ratingTypeWrong: true, name: "Add Your comment"})
        return;
    }
    if(typeof(rating) === 'string' && isNaN(+rating)){
        res.status(400).render('webs/addReviewToGym', {ratingWrong: true, name: "Add Your comment"})
        return;
    }
    
    if(parseInt(rating) < 0 || parseInt(rating) > 5){
        res.status(400).render('webs/addReviewToGym', {outRangeNumber: true, name: "Add Your comment"})
        return;
    }
    let newRating = parseInt(rating)
    console.log(typeof(newRating))
    
    //testcode:
    let aaa = '61a67874028fbaa20828bf7a'
    let bbb = '61a67882028fbaa20828bf7b'
    let reviewer = "US"

    try{
        //TODO: need to know how are they going to pass those userid and gymid
        const addInfo = await reviewDataInfo.addReviewToGym(aaa,bbb, review, newRating, reviewer)
        
        if(addInfo.addReviewtoTheGym === true){
            res.render('webs/reviewAddSuccess', {name: "Successful" })

        }else{
            res.status(400).render('webs/addReviewToGym', {addFail: true, name: "Add Your comment"})
        }
    }catch(e){
        res.status(400).json({ error: e });
    }
});





module.exports = router;

