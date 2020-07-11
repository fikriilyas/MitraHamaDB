const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest, ensureAdmin } = require('../middleware/auth')
const Hama = require('../models/Hama')
const User = require('../models/User')

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

//@desc     Show User Management
//@route    GET /user
router.get('/user', ensureAdmin, async (req, res)=> {
    const user = await User.find().lean()
    res.render('user', {user})
})

//@desc     Handle User Management
//@route    PUT /user
router.put('/user/:id', ensureAdmin, async(req,res) => {
    try {
        let user = await User.findById(req.params.id).lean()
    
        if (!user) {
            return res.render('error/404')
        } else {
            // let new
            // console.log(user._id)
            let new_status = function(user) {
                if (user.status === 'new') {
                    return 'accepted'
                } else {
                    return 'new'
                }
            }
            hama = await User.findOneAndUpdate({_id: req.params.id}, {status: new_status(user)}, {
                new: true,
                runValidators: true
            })
            res.redirect('/user')
        }
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

module.exports = router