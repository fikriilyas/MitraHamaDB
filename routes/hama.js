const express = require('express')
const cloudinary = require('cloudinary')
const formidable = require('formidable');
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Hama = require('../models/Hama')
const cloudinaryConnect = require('../config/cloudinary')

//@desc     Show Add Page
//@route    GET /stories/add
router.get('/add', ensureAuth,(req,res) => {
    res.render('hama/add')
})

router.post('/', ensureAuth, async (req,res) => {
    try {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
        return;
        }
        
        let file_url = cloudinary.uploader.upload (files.gambar.path, async result => {
            data = {
                hama: fields.hama,
                tanaman: fields.tanaman,
                gambar: result.url,
                user: req.user.id,
                obat: fields.obat
            }
            await Hama.create(data)
            res.redirect('/dashboard')
        })
    });
    } catch (err) {
        console.log(err)
    }
})

//@desc     Show All Story
//@route    GET /stories
router.get('/', ensureAuth, async(req,res) => {
    try {
        const hama = await Hama.find()
            .populate('user')
            .sort({createdAt:'desc'})
            .lean()
        res.render('hama/index', {
            hama
        })
    } catch(err) {
        console,log(err)
        res.redirect('error/505')
    }
})

//@desc     Show Single Story
//@route    GET /stories/:id
router.get('/:id', ensureAuth, async (req,res) => {
    try {
        // console.log(req.params.id)
        let hama = await Hama.findById(req.params.id)
            .populate('user')
            .lean()
        
        if(!hama) {
            return res.render('error/404')
        }

        res.render('hama/show', {
            hama
        })

    } catch (err) {
        console.log(err)
        res.render('error/404')
    }
})

//@desc     Show Edit Page
//@route    GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async(req,res) => {
    try {
        const hama = await Hama.findOne({
            _id: req.params.id
        }).lean()
    
        if (!hama) {
            return res.render('error/404')
        }
    
        if (hama.user != req.user.id) {
            res.redirect('/hama')
        } else {
            res.render('hama/edit', {
                hama
            })
        }
    } catch {
        console.log(err)
        return res.render('error/500')
    }
})

//Kirim Edit
router.put('/:id', ensureAuth, async(req,res) => {
    try {
        let hama = await Hama.findById(req.params.id).lean()

        if (!hama) {
            return res.render('error/404')
        }

        if (hama.user != req.user.id) {
            res.redirect('/hama')
        } else {
            story = await Hama.findOneAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })
            console.log(req.body)
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

//@desc     Delete Story
//@route    Delete /stories/:id
router.delete('/:id', ensureAuth, async (req,res) => {
    try {
     await Hama.remove({_id : req.params.id})
     res.redirect('/dashboard')
    } catch (err) {
     console.log(err)
     return res.render('error/500')
    }
 })

module.exports = router