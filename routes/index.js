const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Blogs = require('../models/Blogs')

//@decsription   Login/Landing Page
//@route         GET/
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

//@decsription   Dashboard
//@route         GET/dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const blogss = await Blogs.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            lname: req.user.lastName,
            image: req.user.image,
            blogss,
        })

    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
    //  console.log(req.user)
})



module.exports = router