const userData = require("./users");
const trainersData = require('./trainers')
const gymData = require('./gyms')
const reviewData = require('./review');
const bookData = require('./booking');

module.exports = {
    userData,
    trainersData,
    gymData,
    addReview: reviewData,
    addBooking: bookData

};



