const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const moment = require("moment");


const app = express();
require("./config/passport")(passport);
// DB config
const db = require("./config/keys").MongoURI;
// Connect to mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo DB connected"))
  .catch((err) => console.log(err));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// connect flash
app.use(flash());

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Helpers function

app.locals.formatDate = function (date, format) {
  return moment(date).format(format);
};

app.locals.truncate = function (str, len) {
  if (str.length > len && str.length > 0) {
    let new_str = str + " ";
    new_str = str.substr(0, len);
    new_str = str.substr(0, new_str.lastIndexOf(" "));
    new_str = new_str.length > 0 ? new_str : str.substr(0, len);
    return new_str + "...";
  }
  return str;
};

app.locals.stripTags = function (input) {
  return input.replace(/<(?:.|\n)*?>/gm, "");
};
// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/blogs", require("./routes/blogs"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
