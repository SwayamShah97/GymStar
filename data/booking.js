const mongoCollections = require("../config/mongoCollections");
const createOrder = mongoCollections.Booking;
let { ObjectId } = require('mongodb');

async function createBookingOrder(gymId, userId, date, time){
    if(!gymId) throw "[Booking data Error]:You need to provide the gym ID"
    if(!userId) throw "[Booking data Error]:You need to provide the reviewer ID"
    if(!date) throw "[Booking data Error]: You need to provide a date"
    if(!time) throw "Booking data Error]: You need to provide a time"

    if(typeof(gymId) !== 'string') throw "[Booking data Error]: The gymId need to be a string"
    if(typeof(userId) !== 'string') throw "[Booking data Error]: The userId need to be a string"
    if(typeof(date) !== 'string') throw "[Booking data Error]: The date need to be a string"
    if(typeof(time) !== 'string') throw "[Booking data Error]: The time need to be a string"


    if(gymId.trim().length ===0 ) throw "[Booking data Error]: The gym Id can not be all white space"
    if(userId.trim().length ===0 ) throw "[Booking data Error]: The user Id can not be all white space"
    if(date.trim().length ===0 ) throw "[Booking data Error]: The date can not be all white space"
    if(time.trim().length ===0 ) throw "[Booking data Error]: The time can not be all white space"


    if (!ObjectId.isValid(gymId)) throw "[Booking data Error]:the invalid gym ObjectId"
    if (!ObjectId.isValid(userId)) throw "[Booking data Error]:the invalid user ObjectId"

    if(date.length !== 10) throw "[Booking data Error]: The date is not a vaild date"

    if(isNaN(+date.substring(0,2)) || isNaN(+date.substring(3,5))|| isNaN(+date.substring(6,10))) throw "[Booking data Error]: The date is not a vaild date"

    if(date.substring(0,2).trim().length === 0 ||date.substring(3,5).trim().length === 0|| date.substring(6,10).trim().length === 0 ) throw "[Booking data Error]:The date include space"

    if(parseInt(date.substring(0,2)) > 12 || parseInt(date.substring(0,2)) < 0) throw "[Booking data Error]: The input date is not a vaild month" 
    
    if(parseInt(date.substring(3,5)) > 31 || parseInt(date.substring(0,2)) < 0) throw "[Booking data Error]: The input date is not a vaild day" 

    if(parseInt(date.substring(0,2)) === 2 && parseInt(date.substring(3,5)) > 28 ) throw "[Booking data Error]: The input date is not a vaild day "

    if(parseInt(date.substring(0,2)) === 4 && parseInt(date.substring(3,5)) > 30 ) throw " [Booking data Error]: The input date is not a vaild day "

    if(parseInt(date.substring(0,2)) === 6 && parseInt(date.substring(3,5)) > 30 ) throw " [Booking data Error]: The input date is not a vaild day "

    if(parseInt(date.substring(0,2)) === 9 && parseInt(date.substring(3,5)) > 30 ) throw "[Booking data Error]:  The input date is not a vaild day "

    if(parseInt(date.substring(0,2)) === 11 && parseInt(date.substring(3,5)) > 30 ) throw "[Booking data Error]:  The input date is not a vaild day "
    
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();


    if(time.length !== 5) throw "[Booking data Error]: The time is not a valid time."
    if(isNaN(+time.substring(0,2)) || isNaN(+time.substring(3,5))) throw "[Booking data Error]: The time is not a valid time."
    if(parseInt(time.substring(0,2)) > 24 || parseInt(time.substring(0,2)) < 0 ) throw "[Booking data Error]: The time is not a valid time."
    if(parseInt(time.substring(3,5)) > 60 || parseInt(time.substring(3,5)) < 0)throw "[Booking data Error]: The time is not a valid time."


    today = mm + '/' + dd + '/' + yyyy; 
    if(Date.parse(date) < Date.parse(today)) throw "[Booking data Error]: The date of review must after current date"
    let newOrder = {
        gymId: gymId,
        userId: userId,
        date: date,
        time:time
    }
    const orderData = await createOrder();
    const output = await orderData.insertOne(newOrder);

    return {addNewOrder: true};


    


}

module.exports = {
    createBookingOrder
}
