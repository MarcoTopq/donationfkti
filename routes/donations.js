var express = require('express');
var router = express.Router();
var Donat = require('../models/donations');
var dateFormat = require('dateformat');
var Campaign = require('../models/campaigns');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config/index');
var auth = require('../middleware/auth');
var expressJoi = require('express-joi-validator');
var Joi = require('joi');
// let midtransClient = require('./midtrans-client-nodejs/index.js');
const midtransClient = require('midtrans-client');
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

let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-f2vUoKZ349AaVAR00fT3wv0-',
    clientKey: 'SB-Mid-client-pKIR73LkCixFvGXO'
    // AUTH_STRING = Buffer.from('Mid-client-cePr01XKGoAmnFYC:').toString('base64')
});



router.post('/create', async (req, res) => {
    return new Promise(async (resolve, reject) => {
        // var Id = req.params.id;
        var body = req.body;
        console.log(req.body)
        try {
            var camp = await Campaign.findOne({
                where: {
                    id: body.campaign_id
                }
            })
            console.log(camp)

            var donation = await Donat.create({
                name: body.name,
                email: body.email,
                campaign_id: body.campaign_id,
                donation: body.donation,
                created_at: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                updated_at: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
            })
            console.log("anjay luh")

            // console.log(donation)

            var update = await Campaign.update({
                fundraiser: camp.fundraiser,
                email: camp.email,
                title: camp.title,
                category: camp.category,
                description: camp.description,
                image: camp.image,
                current_donation: body.donation,
                total_donation: camp.total_donation,
                time_limit: camp.time_limit,
                created_at: camp.created_at,
                updated_at: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
            }, {
                where: {
                    id: body.campaign_id
                }
            })
            console.log(update)
            let parameter = {
                "transaction_details": {
                    "order_id": body.name + " " + dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                    "gross_amount": body.donation
                },
                "credit_card": {
                    "secure": true
                }
            };
            let transactionRedirectUrl;
            await snap.createTransaction(parameter)
                .then((transaction) => {
                    // transaction token
                    let transactionToken = transaction.token;
                    console.log('transactionToken:', transactionToken);

                    // transaction redirect url
                    transactionRedirectUrl = transaction.redirect_url;

                    redirectUrl = transaction.redirect_url;
                    console.log('transactionRedirectUrl:', transactionRedirectUrl);
                })
                .catch((e) => {
                    console.log('Error occured:', e.message);
                });

            res.json({
                update,
                donation,
                transactionRedirectUrl
            })
        } catch (error) {
            res.json(error)
        }
    })
});


router.get('/', async (req, res) => {
    await Donat.findAll()
        .then(data => (res.json(data)))
        .catch(err => res.status(400).json(err))
});

router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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