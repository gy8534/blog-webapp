const epxress = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = epxress.Router();
const { ensureGuest } = require("../config/auth");

const Blog = require("../models/Blog");
const User = require("../models/User");



router.get("/login", ensureGuest, (req, res) => {
  res.render("login");
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/sign-up", ensureGuest, (req, res) => {
  res.render("sign-up");
});
router.post("/sign-up", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill all the fields" });
  } else if (password != password2) {
    errors.push({ msg: "Password do not macth" });
  } else if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("sign-up", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "This email is already registered." });
        res.render("sign-up", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            // Store hash in your password DB.
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "You are registered, Please login.");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

router.use("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are logged out!");
  res.redirect("/");
});

router.get("/:id", async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.params.id }).populate('user').sort({createdAt: 'desc'}).lean();;
    const user = await User.findById(req.params.id);

    res.render("blogs/user", {
      name: user.name,
      user: req.user || null,
      blogs,
    });
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});

module.exports = router;
