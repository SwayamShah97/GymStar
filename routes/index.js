const usersRoutes = require('./users.js');
const trainersRoutes = require('./trainers');
const gymRoutes = require('./gyms');


const constructorMethod = app => {
  app.use("/", usersRoutes);
  app.use("/trainers",trainersRoutes);
  app.use('/gyms', gymRoutes);

  app.use("*", (req, res) => {
    res.status(404).render('notFd',{title:'404- page not found'});
  });
};

module.exports = constructorMethod;







