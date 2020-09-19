const epxress = require("express");
const { ensureAuthenticated } = require("../config/auth");

const router = epxress.Router();

const Blog = require("../models/Blog");

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("blog/allBlogs", {
      name: req.user.name,
      blogs,
    });
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id})
      .populate("user")
      .lean();
    res.render("blog/oneBlog", {
      name: req.user.name,
      blog,
    });
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
  
});

router.get("/user/:id", ensureAuthenticated, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.params.id})
      .populate("user")
      .lean();
    res.render("blog/userBlog", {
      name: req.user.name,
      blogs,
    });
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }

});



module.exports = router;
