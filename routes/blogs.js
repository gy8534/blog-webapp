const epxress = require("express");
const router = epxress.Router();

const { ensureAuthenticated } = require("../config/auth");

const Blog = require("../models/Blog");
const User = require("../models/User");

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("blogs/createBlog", {});
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Blog.create(req.body);
    req.flash("success_msg", "Viral Created!!");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("error 500");
  }
});
router.get("/edit/:id",ensureAuthenticated, async(req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
    }).lean()

    if (!blog) {
      return res.send('error/404')
    }

    if (blog.user != req.user.id) {
      res.redirect('/')
    } else {
      res.render('blogs/edit', {
        blog,
      })
    }
  } catch (err) {
    console.error(err)
    return res.send('error/500')
  }
});

router.put('/:id', async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

router.get("/delete/:id",  ensureAuthenticated, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id).lean()

    if (!blog) {
      return res.render('error/404')
    }

    if (blog.user != req.user.id) {
      res.redirect('/')
    } else {
      await Blog.remove({ _id: req.params.id })
      req.flash("success_msg", "Viral Deleted!!");
      res.redirect('/')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
});

module.exports = router;
