var express = require('express');
var router = express.Router();
var User = require('../models/users');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config/index');
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
  await User.findOne({
    where: {
      email: body.email
    }
  }).then(current_user => {
    if (current_user) {
      return res.json("email has been used");
    } else {
      User.create({
        username: body.username,
        email: body.email,
        phone: body.phone,
        password: bcrypt.hashSync(body.password, 10),
        role : 'member'
      })
      .then(data => (res.json(data)))
    }
  })
    .catch(err => res.status(400).json(err));
});

router.post('/signin', async (req, res) => {
  await User.findOne({
    where: {
      email: req.body.email
    }
  }).then((user) => {
    const checkLogin = bcrypt.compareSync(req.body.password, user.password);
    if (checkLogin) {
      var token = jwt.sign({ id: user.id, role: user.role }, config.secret ,{expiresIn: '1h'});
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
})

router.get('/', auth.checkToken, auth.isAuthorized, async (req, res) => {
  await User.findAll()
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
});

router.get('/:id', auth.checkToken, async (req, res) => {
  var Id = req.params.id;
  await User.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("User not found");
      }
      else {
        return res.json(data);
      }
    })
    .catch(err => res.status(400).json(err))
});

router.put('/:id', auth.checkToken, expressJoi(updateSchema), async (req, res) => {
  var Id = req.params.id;
  var body = req.body;
  await User.findOne({
    where: {
      id: Id
    }
  })
    .then(data => {
      if (!data) {
        return res.json("User not found");
      }
      else {
        User.update({
          username: body.username,
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

router.delete('/:id', auth.checkToken, auth.isAuthorized,async (req, res) => {
  var Id = req.params.id;
  await User.update({
    isDelete: true
  }, {
      where: {
        id: Id
      }
    })
  await User.destroy({
    where: {
      id: Id
    }
  })
    .then(res.json("User was remove"))
    .catch(err => res.status(400).json(err))
});

module.exports = router;
