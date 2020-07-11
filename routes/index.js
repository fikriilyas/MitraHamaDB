const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Hama = require('../models/Hama')

//@desc     Login/landing page
//@route    GET /
router.get('/', ensureGuest,(req,res) => {
    res.render('login', {
        layout: 'login',
    })
})

//@desc     Dashboard
//@route    GET /
router.get('/dashboard', ensureAuth, async (req,res) => {
    try {
        const hama = await Hama.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            hama
        })
    } catch(err) {
        console.log(err)
        res.render('error/500')
    }
})

module.exports = router