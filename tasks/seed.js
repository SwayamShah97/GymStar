const dbConnection = require('../config/mongoConnection');


const addReview = require("../data/review");
const gymData = require("../data/gyms");
const  addBooking = require("../data/booking");
const trainersData = require("../data/trainers")
const userData = require("../data/users")


const main = async () => {
    
      const user = await userData.createUser('user','Jane','Doe','janedoe@gmail.com','Hoboken','New Jersey','1234567890','female','12/12/1997','Intermilan@97')
    
    console.log(user);       
     
     const owner = await userData.createUser('owner','John','Seb','johnseb@gmail.com','Hoboken','New Jersey','1234547890','male','11/11/1997','Acmilan@97')
    
    console.log(owner);   
    
     const gym = await gymData.create('johnseb@gmail.com','Platinum Gym', 'jersey city', '1134567890', '$$$$')
    console.log(gym) 
     let id  = await gym._id;
    id = id.toString();
    console.log(id)
    trainerDetails = 
        {"trainerFirstName":"iron","trainerLastName":"man","gymId":{"$oid":id},"phoneNo":{"$numberInt":"1234567890"},"overallRating":{"$numberDouble":0},"emailId":"mal@gmaol.com","gender":"Male","experience":{"$numberInt":"23"}}
    
    const trainer = await trainersData.createTrainer(trainerDetails)
    console.log(trainer); 
     const review = await addReview.addReviewToGym('61b6bd6143c56d9b41c159f3','61b6b797e7f06fbf0be4c014','Amazing work',4,'Jane')
    console.log(review) 

    const booking = await addBooking.createBookingOrder('61b6bd6143c56d9b41c159f3','61b6b797e7f06fbf0be4c014', '12/14/2021', '20:00');
    console.log(booking);
}

main();