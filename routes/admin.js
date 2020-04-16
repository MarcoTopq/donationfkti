'use strict'
var express = require('express');
var router = express.Router();
var Admin = require('../models/admin');
var config = require('../config/index');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var auth = require('../middleware/auth');
var expressJoi = require('express-joi-validator');
var Joi = require('joi');

var bodySchema = {
  body: {
    username: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
  }
};

var updateSchema = {
  body: {
    username: Joi.string().allow(""),
    email: Joi.string().allow(""),
    phone: Joi.string().allow(""),
    password: Joi.string().allow(""),
  }
};
router.post('/signup', expressJoi(bodySchema), async (req, res) => {
  var body = req.body;
  await Admin.findOne({
    where: {
      email: body.email
    }
  }).then(current_user => {
    if (current_user) {
      return res.json("email has been used");
    } else {
      const admin = Admin.create({
        username: body.username,
        email: body.email,
        phone: body.phone,
        password: bcrypt.hashSync(body.password, 10),
        role: 'admin'
      })
        .then(data => (res.json(data)))
    }
  })
    .catch(err => res.status(400).json(err));
});

router.post('/signin', async (req, res) => {
  await Admin.findOne({
    where: {
      email: req.body.email
    }
  }).then((user) => {
    const checkLogin = bcrypt.compareSync(req.body.password, user.password);
    if (checkLogin) {
      console.log("wowwwwwwwwwwwwwwwwwwwww" + user.role)
      var token = jwt.sign({ id: user.id, role: user.role }, config.secret, { expiresIn: 36000 });
      if (token) {
        res.status(200).json({
          message: "Success Sign In",
          token: token
        });
      }
    } else {
      res.status(200).json({
        message: "Failed Sign In",
      });
    }
  }).catch((err) => {
    res.status(200).json({
      message: err.message,
    });
  });
});

router.get('/', async (req, res) => {
  await Admin.findAll()
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.get('/:id',  async (req, res) => {
  var Id = req.params.id;
  await Admin.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("Admin not found");
      }
      else {
        return res.json(data);
      }
    })
    .catch(err => res.status(400).json(err))
});

router.put('/:id', auth.checkToken, auth.isAuthorized, expressJoi(updateSchema), async (req, res) => {
  var Id = req.params.id;
  var body = req.body;
  await Admin.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("Admin not found");
      }
      else {
        Admin.update({
          Adminname: body.Adminname,
          email: body.email,
          phone: body.phone,
          password: body.password
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
  await Admin.update({
    isDelete: true
  }, {
      where: {
        id: Id
      }
    })
  await Admin.destroy({
    where: {
      id: Id
    }
  })
    .then(res.json("Admin was remove"))
    .catch(err => res.status(400).json(err))
});

module.exports = router;




