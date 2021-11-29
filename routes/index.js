const usersRoutes = require('./users.js');

const constructorMethod = app => {
  app.use("/", usersRoutes);

  app.use("*", (req, res) => {
    res.status(404).render('notFd',{title:'404- page not found'});
  });
};

module.exports = constructorMethod;