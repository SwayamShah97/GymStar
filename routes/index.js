const usersRoutes = require('./users.js');
const trainersRoutes = require('./trainers')
const constructorMethod = app => {
  app.use("/", usersRoutes);
  app.use("/trainers",trainersRoutes)

  app.use("*", (req, res) => {
    res.status(404).render('notFd',{title:'404- page not found'});
  });
};

module.exports = constructorMethod;