const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();
require('./config/passport')(passport);
// DB config
const db = require('./config/keys').MongoURI;
// Connect to mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('Mongo DB connected'))
    .catch(err=>console.log(err))
app.use(express.urlencoded({ extended: false }));
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.static(__dirname+'/public'))
// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }))

// connect flash
app.use(flash());

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error');
    next();
  })


// Routes
app.use('/', require('./routes/index'));
app.use('/blogs', require('./routes/blogs'));
app.use('/me', require('./routes/me'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

