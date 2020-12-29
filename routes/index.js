const epxress = require("express");
const router = epxress.Router();

const User = require("../models/User");
const Blog = require("../models/Blog");

router.get("/", async (req, res) => {
  try {
    let blogs = await Blog.find({})
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    let featured = await Blog.find({})
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    featured = featured
      .sort((a, b) => {
        return b.visits - a.visits;
      })
      .slice(0, 3);

    blogs = blogs.slice(0, 10);

    res.render("welcome", {
      blogs,
      featured,
    });
  } catch (err) {
    console.log(err);
    res.send("error/500");
  }
});

router.get("/more_stories", async (req, res) => {
  try {
    let blogs = await Blog.find({})
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("blogs/all", {
      blogs,
    });
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { visits: 1 } },
      { new: true }
    );
    const blog = await Blog.findById(req.params.id)
      .populate('user')
      .sort({ createdAt: "desc" })
      .lean();
    res.render("blogs/blog", {
      blog,
    });
  } catch (err) {
    res.send("error/500");
  }
});

router.get("/tags/:tag", async (req, res) => {
  try {
    let blogs = await Blog.find({ tag: req.params.tag })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("blogs/tag", {
      tag: req.params.tag,
      blogs,
    });
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});

module.exports = router;
