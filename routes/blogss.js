const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth')

const Blogs = require('../models/Blogs')

//@decsription   Show add pages
//@route         GET/blogss/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('blogss/add')
})

//@decsription   process add blog
//@route         POST/blogss

router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Blogs.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})



//@decsription   Show all blogs
//@route         GET/blogss/add
router.get('/', ensureAuth, async (req, res) => {
    const {page,limit} = req.query;
    const skip = (page-1)*2;
    const users = await Blogs.find().skip().limit(limit);
    try {
        const blogss = await Blogs.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('blogss/index', {
            blogss,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


//@decsription   Show Single Story
//@route         GET/blogss/:id
router.get('/:id', ensureAuth, async(req, res) => {
    try{
        let blog = await Blogs.findById(req.params.id)
        .populate('user')
        .lean()

        if(!blog){
            return res.render('error/404')
        }

        res.render('blogss/show',{
            blog
        })
    } catch (err){
        console.error(err);
        res.render('error/404')
    }
})


//@decsription   Show edit page
//@route         GET/blogss/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const blog = await Blogs.findOne({
            _id: req.params.id
        }).lean()

        if (!blog) {
            return res.render('error/404')
        }

        if (blog.user != req.user.id) {
            res.redirect('/blogss')
        } else {
            res.render('blogss/edit', {
                blog,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//@decsription   Update Blogs
//@route         PUT/blogss/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let blog = await Blogs.findById(req.params.id).lean()

        if (!blog) {
            return res.render('error/404')
        }

        if (blog.user != req.user.id) {
            res.redirect('/blogss')
        } else {
            blog = await Blogs.findOneAndUpdate({ _id: req.params.id }, req.body, {
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

//@decsription   Delete Story
//@route         DELETE/blogss/id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Blogs.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @description    User blogss
// @route   GET /blogss/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
      const blogss = await Blogs.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('blogss/index', {
        blogss,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

module.exports = router