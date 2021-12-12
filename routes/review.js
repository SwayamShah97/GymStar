const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewDataInfo = data.addReview;
const xss = require('xss');




router.get('/addReviewToGym/:id', async(req,res) =>{
    if(req.session.user){
        loggedin = true
        fname = req.session.user.firstName
        let id = req.params;
        res.render('webs/addReviewToGym',{name: "Add review to Gym" , gymId:id})
      }
      else{
        loggedin = false
        res.redirect('/login')
      }
    //     let id = req.params;
    // res.render('webs/booking',{message: "Make an appointment" , gymId:id,loggedin})
      


    //let id = req.params;
    //res.render('webs/addReviewToGym',{name: "Add review to Gym" , gymId:id})
});



router.post('/addReviewToGym/:id', async (req, res) => {

    // if(req.session.user){
    //     loggedin != true
    //     res.redirect('/login')

    // }
    req.body.review = xss(req.body.review);
    review = req.body.review;

    req.body.rating = xss(req.body.rating)
    rating = req.body.rating;

    req.params.id = xss(req.params.id);
    gymId = req.params.id;
    
    req.session.user.id = xss(req.session.user.id);
    userId = req.session.user.id;

    req.session.user.firstName = xss(req.session.user.firstName);
    reviewer = req.session.user.firstName;

    

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
    

    try{
        const addInfo = await reviewDataInfo.addReviewToGym(gymId,userId,review,newRating,reviewer)
        console.log(addInfo.addReviewtoTheGym)
        
        if(addInfo.addReviewtoTheGym === true){
            console.log(1)
            res.render('webs/reviewAddSuccess', {name: "Successful" })

        }else{
            res.status(400).render('webs/addReviewToGym', {addFail: true, name: "Add Your comment"})
        }
    }catch(e){
        res.status(400).json({ error: e });
    }
});


router.get('/deleteReview/:id', async(req,res) =>{
    if(req.session.user){
        loggedin = true
        fname = req.session.user.firstName
        let id = req.params;
        req.params.id = xss(req.params.id);
        let reviewId = req.params.id;

        req.session.user.id = xss(req.session.user.id);
        let userId = req.session.user.id;
        try{
            const deleteInfo = await reviewDataInfo.remove(reviewId,userId);
            if(deleteInfo.deleted === true){
                let message = "Your review is successful deleted"
                res.render('webs/deleteReview', {name: "Delete Successful", message: message})
            }else{
                let message = "Delete fail, try again"
                res.status(400).render('webs/deleteReview', {name: "Error", message:message})
            }
        }catch(e){
            res.status(400).json({ error: e });
        }
        // res.render('webs/deleteReview',{name: "Delete" , gymId:id})  
    }
    else{
        loggedin = false
        res.redirect('/login')
    }

    
});

// router.post('/deleteReview/:id', async(req,res) =>{

//     let reviewId
//     let userId

//     if (!reviewId){
//         res.status(400).render('webs/deleteReview', {CanNotFindReviewId: true, name: "edite your review"})
//         return;
//     }

//     if (!userId){
//         res.status(400).render('webs/deleteReview', {CanNotFindUserId: true, name: "edite your review"})
//         return;
//     }

//     if ((typeof reviewId !== 'string')){
//         res.status(400).render('webs/deleteReview', {WrongreviewIdType: true, name: "edite your review"})
//         return;
//     }

//     if ((typeof userId !== 'string')){
//         res.status(400).render('webs/deleteReview', {WrongUserIdType: true, name: "edite your review"})
//         return;
//     }

//     if (!ObjectId.isValid(reviewId)){
//         res.status(400).render('webs/deleteReview', {notVaildReviewId: true, name: "edite your review"})
//         return;
//     }


//     if (!ObjectId.isValid(userId)){
//         res.status(400).render('webs/deleteReview', {notVaildUserId: true, name: "edite your review"})
//         return;
//     }

//     try{
//         const deleteInfo = await reviewDataInfo.remove(reviewId);
//         if(deleteInfo.deleted === true){
//             res.render('webs/RemoveSucess', {name: "Successful" })
//         }else{
//             res.status(400).render('webs/deleteReviewSuccess', {deleteFail: true, name: "edite your review"})
//         }
//     }catch(e){
//         res.status(400).json({ error: e });
//     }

// })


router.get('/editeReview/:id', async(req,res) =>{

    if(req.session.user){
        loggedin = true
        fname = req.session.user.firstName
        let id = req.params;
        res.render('webs/editeReview',{name: "edite your review", reviewId: id})
      }
      else{
        loggedin = false
        res.redirect('/login')
      }


});


router.post('/editeReview/:id', async(req,res) =>{
    req.params.id = xss(req.params.id);
    reviewId = req.params.id;

    req.session.user.id = xss(req.session.user.id);
    userId = req.session.user.id;

    req.body.review = xss(req.body.review);
    review = req.body.review;

    req.body.rating = xss(req.body.rating)
    rating = req.body.rating;


    if (!reviewId){
        res.status(400).render('webs/editeReview', {CanNotFindReviewId: true, name: "edite your review"})
        return;
    }

    if (!gymId){
        res.status(400).render('webs/editeReview', {CanNotFindGymId: true, name: "edite your review"})
        return;
    }

    if (!userId){
        res.status(400).render('webs/editeReview', {CanNotFindUserId: true, name: "edite your review"})
        return;
    }


    if ((typeof reviewId !== 'string')){
        res.status(400).render('webs/editeReview', {WrongreviewIdType: true, name: "edite your review"})
        return;
    }

    if ((typeof userId !== 'string')){
        res.status(400).render('webs/editeReview', {WrongUserIdType: true, name: "edite your review"})
        return;
    }

    if(!review){
        res.status(400).render('webs/editeReview', {ReviewNotProvide: true, name: "edite your review"})
        return;
    }
    if(typeof(review)!== 'string'){
        res.status(400).render('webs/editeReview', {reviewTypeWrong: true, name: "edite your review"})
        return;

    }
    if(review.trim().length === 0){
        res.status(400).render('webs/editeReview', {reviewSapce: true, name: "edite your review"})
        return;
    }
    if(!rating){
        res.status(400).render('webs/editeReview', {ratingNotProvide: true, name: "edite your review"})
        return;
    }
    if(typeof(rating)!== 'string' ){
        res.status(400).render('webs/editeReview', {ratingTypeWrong: true, name: "edite your review"})
        return;
    }


    if (!ObjectId.isValid(reviewId)){
        res.status(400).render('webs/editeReview', {notVaildReviewId: true, name: "edite your review"})
        return;
    }


    if (!ObjectId.isValid(userId)){
        res.status(400).render('webs/editeReview', {notVaildUserId: true, name: "edite your review"})
        return;
    }
    if(review.trim().length === 0){
        res.status(400).render('webs/editeReview', {reviewSapce: true, name: "edite your review"})
        return;
    }

    if(typeof(rating) === 'string' && isNaN(+rating)){
        res.status(400).render('webs/editeReview', {ratingWrong: true, name: "edite your review"})
        return;
    }
    
    if(parseInt(rating) < 0 || parseInt(rating) > 5){
        res.status(400).render('webs/editeReview', {outRangeNumber: true, name: "edite your review"})
        return;
    }

    let newRating = parseInt(rating);


    try{
        const editeInfo = await reviewDataInfo.update(reviewId,userId,review,newRating);
        if(editeInfo.updateSuccess === true){
            res.render('webs/editeSuccess', {name: "Successful" })
        }else{
            res.status(400).render('webs/editeReview', {editeFail: true, name: "edite your review"})
        }
    }catch(e){
        res.status(400).json({ error: e });
    }


});




module.exports = router;

