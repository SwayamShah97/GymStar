const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.connectToDb();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
module.exports = {
    trainers: getCollectionFn('trainers'),
    reviews: getCollectionFn('reviews'),
//   You all can add your respective collections here
    users: getCollectionFn('users')

 
};