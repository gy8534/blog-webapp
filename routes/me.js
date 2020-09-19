const epxress = require('express');
const { ensureAuthenticated } = require('../config/auth');

const router = epxress.Router();

const Blog = require('../models/Blog')


router.get('/blogs', ensureAuthenticated, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id }).sort({createdAt: 'desc'}).lean();
        res.render("me/blogs", {
          name: req.user.name,
          blogs,
        });
      } catch (err) {
        console.log(err);
        res.render("error/500");
      }
})

router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("me/add", {
      name: req.user.name,
    });
  });
  
  router.post("/add", ensureAuthenticated, async (req, res) => {
    try {
      req.body.user = req.user.id;
      await Blog.create(req.body);
      res.redirect("/blogs");
    } catch (err) {
      res.render("error/500");
    }
  });

module.exports = router;