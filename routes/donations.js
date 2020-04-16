var express = require('express');
var router = express.Router();
var Donation = require('../models/donations');
var Campaign = require('../models/campaigns');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config/index');
var auth = require('../middleware/auth');
var expressJoi = require('express-joi-validator');
var Joi = require('joi');

var bodySchema = {
    body: {
        name: Joi.string().required(),
        id_campaign: Joi.string().required(),
        donation: Joi.string().required(),
    }
};

var updateSchema = {
    body: {
        name: Joi.string().allow(""),
        id_campaign: Joi.string().allow(""),
        donation: Joi.string().allow(""),
    }
};

router.post('/create/id', expressJoi(bodySchema), async (req, res) => {
    return new Promise(async (resolve, reject) => {
        var Id = req.params.id;
        var body = req.body;
        console.log(req.body)
        try {
            var campaign = await Campaign.findOne({
                where : {
                    id: Id
                }
            })
            var donation = await Donation.create({
                name: body.name,
                email: body.email,
                id_campaign: Id,
                donation: body.donation,
            })
            var update = await Campaign.update({
                current_donations : campaign.current_donations + body.current_donations,
                total_donations : campaign.total_donations + body.total_donations
            }, {
                where: {
                    id: Id
                }
            })
            return res.json(donation)
        } catch (error) {
            res.json(error)
        }
    })
});


router.get('/', auth.checkToken, auth.isAuthorized, async (req, res) => {
    await Donation.findAll()
        .then(data => (res.json(data)))
        .catch(err => res.status(400).json(err))
});

router.get('/:id', auth.checkToken, async (req, res) => {
    var Id = req.params.id;
    await Donation.findOne({
            where: {
                id: Id
            }
        })
        .then(data => {
            if (!data) {
                return res.json("Donation not found");
            } else {
                return res.json(data);
            }
        })
        .catch(err => res.status(400).json(err))
});

router.put('/:id', auth.checkToken, expressJoi(updateSchema), async (req, res) => {
    var Id = req.params.id;
    var body = req.body;
    await Donation.findOne({
            where: {
                id: Id
            }
        })
        .then(data => {
            if (!data) {
                return res.json("Donation not found");
            } else {
                Donation.update({
                    name: body.name,
                    email: body.email,
                    id_campaign: body.id_campaign,
                    donation: body.donation,
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
    await Donation.update({
        isDelete: true
    }, {
        where: {
            id: Id
        }
    })
    await Donation.destroy({
            where: {
                id: Id
            }
        })
        .then(res.json("Donation was remove"))
        .catch(err => res.status(400).json(err))
});

module.exports = router;