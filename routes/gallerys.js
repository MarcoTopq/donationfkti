var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var Gallerys = require('../models/gallerys');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config/index');
var auth = require('../middleware/auth');
var expressJoi = require('express-joi-validator');
var Joi = require('joi');
var multer = require('multer');
var path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({
    storage: storage
})

var bodySchema = {
    body: {
        fundraiser: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        current_donation: Joi.string().required(),
        total_donation: Joi.string().required(),
        time_limit: Joi.string().required(),
    }
};

var updateSchema = {
    body: {
        fundraiser: Joi.string().allow(""),
        title: Joi.string().allow(""),
        description: Joi.string().allow(""),
        current_donation: Joi.string().allow(""),
        total_donation: Joi.string().allow(""),
        time_limit: Joi.string().allow(""),
    }
};

router.post('/image', upload.single('photos'), async (req, res) => {
    return new Promise(async (resolve, reject) => {
        console.log(req.file)
        var file = req.file
        var body = req.body;
        console.log(req.body);
        console.log(req.file)
        try {
            res.json({
                image: file.filename
            })
        } catch (error) {
            res.json(error)
        }
    })
});

router.post('/create', async (req, res) => {
    return new Promise(async (resolve, reject) => {
        console.log(req.file)
        var body = req.body;
        console.log(req.body);
        console.log(req.file)
        try {
            var gallerys = await Gallerys.create({
                title: body.title,
                description: body.description,
                image: body.image,
                created_at: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                updated_at: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
            })
            res.json(gallerys)
        } catch (error) {
            res.json(error)
        }
    })
});


router.get('/', async (req, res) => {
    await Gallerys.findAll()
        .then(data => (res.json(data)))
        .catch(err => res.status(400).json(err))
});

router.get('/:id', async (req, res) => {
    var Id = req.params.id;
    await Gallerys.findOne({
            where: {
                id: Id
            }
        })
        .then(data => {
            if (!data) {
                return res.json("Gallerys not found");
            } else {
                return res.json(data);
            }
        })
        .catch(err => res.status(400).json(err))
});

router.put('/:id', auth.checkToken, expressJoi(updateSchema), async (req, res) => {
    var Id = req.params.id;
    var body = req.body;
    await Gallerys.findOne({
            where: {
                id: Id
            }
        })
        .then(data => {
            if (!data) {
                return res.json("Gallerys not found");
            } else {
                Gallerys.update({
                    title: body.title,
                    description: body.description,
                    image: body.image,
                    update_at: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
                }, {
                    where: {
                        id: Id
                    }
                })
            }
        })
        .then(data => (res.json(data)))
        .catch(err => res.status(400).json(err))
})

router.delete('/:id', auth.checkToken, auth.isAuthorized, async (req, res) => {
    var Id = req.params.id;
    await Gallerys.update({
        isDelete: true
    }, {
        where: {
            id: Id
        }
    })
    await Gallerys.destroy({
            where: {
                id: Id
            }
        })
        .then(res.json("Gallerys was remove"))
        .catch(err => res.status(400).json(err))
});

module.exports = router;