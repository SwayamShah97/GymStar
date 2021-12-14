const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  }
});
const test = 'this is for testing'
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//swayam adding below

var hbs = exphbs.create({});
hbs.handlebars.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 0; i < n; ++i)
      accum += block.fn(i);
  return accum;
});

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

const session = require('express-session');

app.use(
  session({
    name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
  })
);

const logger = function (request, response, next) {
  console.log(`[${new Date().toUTCString()}]: ${request.method}${request.originalUrl}${request.session.user ? '(Authenticated User)' : '(Non-Authenticated User)'}`);
  next()
};
app.use(logger);



// app.use('/private', (req, res, next) => {
//   // console.log(req.session.id);
//   if (!req.session.user) {
//     return res.status(403).render('notlogged', {title:'403'});
//   } else {
//     next();
//   }
// });

// app.use('/login', (req, res, next) => {
//   if (req.session.user) {
//     return res.redirect('/private');
//   } else {
//     //here I',m just manually setting the req.method to post since it's usually coming from a form
//     //  req.method = 'POST';
//     next();
//   }
// });

configRoutes(app);

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');

  
});
