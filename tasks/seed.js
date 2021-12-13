const dbConnection = require('../config/mongoConnection');


const addReview = require("../data/review");
const gymData = require("../data/gyms");
const  addBooking = require("../data/booking");
const trainersData = require("../data/trainers")
const userData = require("../data/users")


const main = async () => {
    
      const gym = await gymData.update('61b6cc7982845097e905bf33','fitnessbruh','Hoboken','1234567890','$$')
      console.log(gym)
    
}

main();

