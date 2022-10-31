const express = require('express');
const passport = require('passport');
const router = express.Router();

//@decsription   Auth with google
//@route         GET/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@decsription   Google auth callback
//@route         GET/auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect:
        '/'
}), (req, res) => {
    res.redirect('/dashboard')
})

//@decription   Logout user
//@route        /auth/logout
// router.get('/logout', (req,res) => {
//     req.logout()
//     res.redirect('/')
// })

router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");
    });
});



module.exports = router