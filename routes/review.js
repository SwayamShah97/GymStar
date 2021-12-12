const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewDataInfo = data.addReview;
const userData = require("../data").userData;
const xss = require('xss');




router.get('/addReviewToGym/:id', async(req,res) =>{
    if(req.session.user){
        loggedin = true
        let userid = req.session.user.id
        userDetails = await userData.getUserById(userid)
        fname = userDetails.firstName
        let id = req.params;
        res.render('webs/addReviewToGym',{gymId:id,loggedin,name:fname, title: "Review Page"})
      }
      else{
        loggedin = false
        res.redirect('/login')
      }
    //     let id = req.params;
    // res.render('webs/booking',{message: "Make an appointment" , gymId:id,loggedin})
      


    //let id = req.params;
    //res.render('webs/addReviewToGym',{message: "Add review to Gym" , gymId:id})
});



router.post('/addReviewToGym/:id', async (req, res) => {

    let loggedin
    let fname
    if(!req.session.user){
        
        res.redirect('/login')
        return
    }
    else if(req.session.user){
        loggedin = true
        let userid = req.session.user.id
        userDetails = await userData.getUserById(userid)
        fname = userDetails.firstName
    }
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
        res.status(400).render('webs/addReviewToGym', {ReviewNotProvide: true, title: "Error",loggedin,name:fname})
        return;
    }
    if(typeof(review)!== 'string'){
        res.status(400).render('webs/addReviewToGym', {reviewTypeWrong: true, title: "Error",loggedin,name:fname})
        return;

    }
    if(review.trim().length === 0){
        res.status(400).render('webs/addReviewToGym', {reviewSapce: true, title: "Error",loggedin,name:fname})
        return;
    }
    if(!rating){
        res.status(400).render('webs/addReviewToGym', {ratingNotProvide: true, title: "Error",loggedin,name:fname})
        return;
    }
    if(typeof(rating)!== 'string' ){
        res.status(400).render('webs/addReviewToGym', {ratingTypeWrong: true, title: "Error",loggedin,name:fname})
        return;
    }
    if(typeof(rating) === 'string' && isNaN(+rating)){
        res.status(400).render('webs/addReviewToGym', {ratingWrong: true, title: "Error",loggedin,name:fname})
        return;
    }
    
    if(parseInt(rating) < 0 || parseInt(rating) > 5){
        res.status(400).render('webs/addReviewToGym', {outRangeNumber: true, title: "Error",loggedin,name:fname})
        return;
    }
    let newRating = parseInt(rating)
    
    

    try{
        const addInfo = await reviewDataInfo.addReviewToGym(gymId,userId,review,newRating,reviewer)
        
        
        if(addInfo.addReviewtoTheGym === true){
            
            res.render('webs/reviewAddSuccess', {name1: "Successful" ,loggedin,name:fname})

        }else{
            res.status(400).render('webs/addReviewToGym', {addFail: true, message: "Error",loggedin,name:fname})
        }
    }catch(e){
        res.status(400).json({ error: e });
    }
});


router.get('/deleteReview/:id', async(req,res) =>{
    if(req.session.user){
        loggedin = true
        let userid = req.session.user.id
        userDetails = await userData.getUserById(userid)
        fname = userDetails.firstName
        let id = req.params;
        req.params.id = xss(req.params.id);
        let reviewId = req.params.id;

        req.session.user.id = xss(req.session.user.id);
        let userId = req.session.user.id;
        try{
            const deleteInfo = await reviewDataInfo.remove(reviewId,userId);
            if(deleteInfo.deleted === true){
                let message = "Your review is successful deleted"
                res.render('webs/deleteReview', {title: "Delete Successful", message: message,loggedin,name:fname});
            }else{
                let message = "Delete fail, try again"
                res.status(400).render('webs/deleteReview', {title: "Error", message:message,loggedin,name:fname});
            }
        }catch(e){
            error = "The review is already deleted."
            res.status(400).render('webs/deleteReview', { title: "Error",error: error,loggedin,name:fname});
            // what should be rendered here/ when no review with that id to delete
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
//         res.status(400).render('webs/deleteReview', {CanNotFindReviewId: true, message: "edite your review"})
//         return;
//     }

//     if (!userId){
//         res.status(400).render('webs/deleteReview', {CanNotFindUserId: true, message: "edite your review"})
//         return;
//     }

//     if ((typeof reviewId !== 'string')){
//         res.status(400).render('webs/deleteReview', {WrongreviewIdType: true, message: "edite your review"})
//         return;
//     }

//     if ((typeof userId !== 'string')){
//         res.status(400).render('webs/deleteReview', {WrongUserIdType: true, message: "edite your review"})
//         return;
//     }

//     if (!ObjectId.isValid(reviewId)){
//         res.status(400).render('webs/deleteReview', {notVaildReviewId: true, message: "edite your review"})
//         return;
//     }


//     if (!ObjectId.isValid(userId)){
//         res.status(400).render('webs/deleteReview', {notVaildUserId: true, message: "edite your review"})
//         return;
//     }

//     try{
//         const deleteInfo = await reviewDataInfo.remove(reviewId);
//         if(deleteInfo.deleted === true){
//             res.render('webs/RemoveSucess', {name: "Successful" })
//         }else{
//             res.status(400).render('webs/deleteReviewSuccess', {deleteFail: true, message: "edite your review"})
//         }
//     }catch(e){
//         res.status(400).json({ error: e });
//     }

// })


router.get('/editeReview/:id', async(req,res) =>{

    if(req.session.user){
        loggedin = true
        let userid = req.session.user.id
        userDetails = await userData.getUserById(userid)
        fname = userDetails.firstName
        let id = req.params;
        
        const review = await reviewDataInfo.getReviewByID(id.id);
        
        let reviewText = review.reviewText
        let rating = review.rating
        
        res.render('webs/editeReview',{title: "edite your review",rating,reviewText, reviewId: id,loggedin,name:fname})
      }
      else{
        loggedin = false
        res.redirect('/login')
      }


});


router.post('/editeReview/:id', async(req,res) =>{

    let loggedin
    let fname
    if(!req.session.user){
        
        res.redirect('/login')
        return
    }
    else if(req.session.user){
        loggedin = true
        let userid = req.session.user.id
        userDetails = await userData.getUserById(userid)
        fname = userDetails.firstName
    }
    req.params.id = xss(req.params.id);
    reviewId = req.params.id;

    req.session.user.id = xss(req.session.user.id);
    userId = req.session.user.id;

    req.body.review = xss(req.body.review);
    review = req.body.review;

    req.body.rating = xss(req.body.rating)
    rating = req.body.rating;


    if (!reviewId){
        res.status(400).render('webs/editeReview', {CanNotFindReviewId: true, title: "Error",loggedin,name:fname})
        return;
    }

    if (!gymId){
        res.status(400).render('webs/editeReview', {CanNotFindGymId: true, title: "Error",loggedin,name:fname})
        return;
    }

    if (!userId){
        res.status(400).render('webs/editeReview', {CanNotFindUserId: true, title: "Error",loggedin,name:fname})
        return;
    }


    if ((typeof reviewId !== 'string')){
        res.status(400).render('webs/editeReview', {WrongreviewIdType: true, title: "Error",loggedin,name:fname})
        return;
    }

    if ((typeof userId !== 'string')){
        res.status(400).render('webs/editeReview', {WrongUserIdType: true, title: "Error",loggedin,name:fname})
        return;
    }

    if(!review){
        res.status(400).render('webs/editeReview', {ReviewNotProvide: true, title: "Error",loggedin,name:fname})
        return;
    }
    if(typeof(review)!== 'string'){
        res.status(400).render('webs/editeReview', {reviewTypeWrong: true, title: "Error",loggedin,name:fname})
        return;

    }
    if(review.trim().length === 0){
        res.status(400).render('webs/editeReview', {reviewSapce: true, title: "Error",loggedin,name:fname})
        return;
    }
    if(!rating){
        res.status(400).render('webs/editeReview', {ratingNotProvide: true, title: "Error",loggedin,name:fname})
        return;
    }
    if(typeof(rating)!== 'string' ){
        res.status(400).render('webs/editeReview', {ratingTypeWrong: true, title: "Error",loggedin,name:fname})
        return;
    }


    if (!ObjectId.isValid(reviewId)){
        res.status(400).render('webs/editeReview', {notVaildReviewId: true, title: "Error",loggedin,name:fname})
        return;
    }


    if (!ObjectId.isValid(userId)){
        res.status(400).render('webs/editeReview', {notVaildUserId: true, title: "Error",loggedin,name:fname})
        return;
    }
    if(review.trim().length === 0){
        res.status(400).render('webs/editeReview', {reviewSapce: true, title: "Error",loggedin,name:fname})
        return;
    }

    if(typeof(rating) === 'string' && isNaN(+rating)){
        res.status(400).render('webs/editeReview', {ratingWrong: true, title: "Error",loggedin,name:fname})
        return;
    }
    
    if(parseInt(rating) < 0 || parseInt(rating) > 5){
        res.status(400).render('webs/editeReview', {outRangeNumber: true, title: "Error",loggedin,name:fname})
        return;
    }

    let newRating = parseInt(rating);


    try{
        const editeInfo = await reviewDataInfo.update(reviewId,userId,review,newRating);
        if(editeInfo.updateSuccess === true){
            res.render('webs/editeSuccess', {name1: "Successful",success:true ,loggedin,name:fname})
        }else{
            res.status(400).render('webs/editeReview', {editeFail: true,error:true, message: "edite your review",loggedin,name:fname})
        }
    }catch(e){
        res.status(400).json({ error: e });
    }


});




module.exports = router;

