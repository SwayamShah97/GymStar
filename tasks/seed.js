const dbConnection = require('../config/mongoConnection');


const reviewData = require("../data/review")



const main = async () => {
    
    /* const blueGym = await gymData.search("Hoboken");
    console.log(blueGym);     */
     
    /* const abc = await gyms.getAllGyms();
    console.log(abc)   */

       /* a = await reviews.create("617a05e8e59ceebb693b452e", "tkl", "sm", 1, "10/29/2021", " ruh");
    console.log(a)   */ 
   /*  a = await reviews.getAll([1,2,3])
    console.log(a)  */   

    /* a = await restaurants.getAllForRoutes()
    console.log(a) */
 
     /* a = await reviews.get("617a07afeae615cff755fec7")
    console.log(a)  */   
    const gg = await reviewData.addReviewToGym("61a3fa24c1ac1e48f7fa7fb9", "61b04488c88d431c051f97cb","superb", 3,"swom")
    console.log(gg)
     

}

main();