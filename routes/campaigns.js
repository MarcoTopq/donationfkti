var express = require('express');
var router = express.Router();
// var description = require('../models/descriptions');
var Campaign = require('../models/campaigns');
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

router.post('/create', upload.single('photos'), async (req, res) => {
    return new Promise(async (resolve, reject) => {
        console.log(req.file)
        var Id = req.params.id;
        var file = req.file
        var body = req.body;
        console.log(req.body);
        console.log(req.file)
        try {
            var campaign = await Campaign.create({
                fundraiser: body.fundraiser,
                email: body.email,
                title: Id,
                description: body.description,
                image: file.filename,
                current_donation: body.current_donation,
                total_donation: body.total_donation,
                time_limit: body.time_limit
            })
            res.json(campaign)
        } catch (error) {
            res.json(error)
        }
    })
});


router.get('/', async (req, res) => {
    await Campaign.findAll()
        .then(data => (res.json(data)))
        .catch(err => res.status(400).json(err))
});

router.get('/:id', async (req, res) => {
    var Id = req.params.id;
    await Campaign.findOne({
            where: {
                id: Id
            }
        })
        .then(data => {
            if (!data) {
                return res.json("campaign not found");
            } else {
                return res.json(data);
            }
        })
        .catch(err => res.status(400).json(err))
});

router.put('/:id', auth.checkToken, expressJoi(updateSchema), async (req, res) => {
    var Id = req.params.id;
    var body = req.body;
    await Campaign.findOne({
            where: {
                id: Id
            }
        })
        .then(data => {
            if (!data) {
                return res.json("campaign not found");
            } else {
                Campaign.update({
                    fundraiser: body.fundraiser,
                    email: body.email,
                    title: body.title,
                    description: body.description,
                    image: body.image,
                    current_donation: body.current_donation,
                    total_donation: body.total_donation,
                    time_limit: body.time_limit
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
    await Campaign.update({
        isDelete: true
    }, {
        where: {
            id: Id
        }
    })
    await Campaign.destroy({
            where: {
                id: Id
            }
        })
        .then(res.json("campaign was remove"))
        .catch(err => res.status(400).json(err))
});

module.exports = router;