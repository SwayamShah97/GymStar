const dbConnection = require('../config/mongoConnection');

const gymData = require('../data').gymData;



const main = async () => {
    
    /* const blueGym = await gymData.search("Hoboken");
    console.log(blueGym);     */
     
    /* const abc = await gyms.getAllGyms();
    console.log(abc)   */

    const redHotel = await gymData.getGym('61a6d05e1ca93bab2f39ca40');
    console.log(redHotel);    

       /* a = await reviews.create("617a05e8e59ceebb693b452e", "tkl", "sm", 1, "10/29/2021", " ruh");
    console.log(a)   */ 
   /*  a = await reviews.getAll([1,2,3])
    console.log(a)  */   

    /* a = await restaurants.getAllForRoutes()
    console.log(a) */
 
     /* a = await reviews.get("617a07afeae615cff755fec7")
    console.log(a)  */   
     

     

}

main();