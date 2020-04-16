'use strict'
var express = require('express');
var router = express.Router();
// var Genre = require('../models/genre');
const sequelize = require('sequelize');
var mysql = require('mysql');
const querystring = require('querystring');
var Mangas = require('../models/mangas');
var Pictures = require('../models/pictures')
const redis = require('redis');
const client = redis.createClient(6379);

router.get('/', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const genreRedisKey = 'genre';
      // Try fetching the result from Redis first in case we have it cached
      return client.get(genreRedisKey, async (err, genre) => {
        // If that key exists in Redis store
        if (genre) {
          return res.json(JSON.parse(genre));
        } else {
          var connection = mysql.createConnection({
            host: '91.92.109.216',
            user: 'admin_dropout',
            password: 'Mentulan123',
            database: 'admin_dropout',
          });
          connection.connect();
          connection.query(
            'SELECT * FROM `tagging_tags`',
            //  + 'AND `taggable_type` = "App\\\\manga"',
            function (err, results, fields) {
              client.setex(genreRedisKey, 3600, JSON.stringify(results))
              return res.json(results);
            });
          connection.end();
        }
      })
    } catch (error) {
      res.json(error);
    }
  })
})

router.get('/all', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const genreRedisKey = 'genre';
      // Try fetching the result from Redis first in case we have it cached
      // return client.get(genreRedisKey, async (err, genre) => {
        // If that key exists in Redis store
        // if (genre) {
        //   return res.json(JSON.parse(genre));
        // } else {
          var connection = mysql.createConnection({
            host: '91.92.109.216',
            user: 'admin_dropout',
            password: 'Mentulan123',
            database: 'admin_dropout',
          });
          connection.connect();
          connection.query(
            'SELECT * FROM `tagging_tags`',
            //  + 'AND `taggable_type` = "App\\\\manga"',
            function (err, results, fields) {
              // client.setex(genreRedisKey, 3600, JSON.stringify(results))
              // return res.json(results);
              return res.render('genre', { genre: results })
            });
          connection.end();
        // }
      // })
    } catch (error) {
      res.json(error);
    }
  })
})

router.get('/grup/', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let slug = req.query.slug;
      var connection = mysql.createConnection({
        host: '91.92.109.216',
        user: 'admin_dropout',
        password: 'Mentulan123',
        database: 'admin_dropout',
      });
      connection.connect();
      connection.query(
        'SELECT * FROM `tagging_tagged` WHERE `tag_slug` = ?', [slug],
        //  + 'AND `taggable_type` = "App\\\\manga"',
        async function (err, results, fields) {

          let hots = await Promise.all(results.map(async hot => {
            let order_obj = JSON.parse(JSON.stringify(hot));

            let mangas = await Mangas.findOne({
              where: {
                id: order_obj.taggable_id
              }
            })
            let pictures = await Pictures.findOne({
              where: {
                'picture_id': order_obj.taggable_id,
                'picture_type': 'App\\manga'
              }
            })
            order_obj.mangas = mangas;
            order_obj.pictures = pictures;
            return order_obj;
          }))
          return res.json(hots);
        });
      connection.end();
    } catch (error) {
      res.json(error);
    }
  })
})

router.get('/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Id = req.params.id;
      let type = 'App\\manga'
      var connection = mysql.createConnection({
        host: '91.92.109.216',
        user: 'admin_dropout',
        password: 'Mentulan123',
        database: 'admin_dropout',
      });
      connection.connect();
      connection.query(
        'SELECT * FROM `tagging_tagged` WHERE `taggable_id` = ' + Id,
        //  + 'AND `taggable_type` = "App\\\\manga"',
        function (err, results, fields) {
          return res.json(results);
        });
      connection.end();
    } catch (error) {
      res.json(error);
    }
  })
})

router.post('/all/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    var Id = req.params.id;
    var body = req.body;
    try {
      // const genreRedisKey = 'genre';
      // Try fetching the result from Redis first in case we have it cached
      // return client.get(genreRedisKey, async (err, genre) => {
        // If that key exists in Redis store
        // if (genre) {
        //   return res.json(JSON.parse(genre));
        // } else {
          var connection = mysql.createConnection({
            host: '91.92.109.216',
            user: 'admin_dropout',
            password: 'Mentulan123',
            database: 'admin_dropout',
          });
          connection.connect();
          connection.query(
            'UPDATE `tagging_tags` SET `statusage` = ? WHERE `id` = ?', [body.statusage, Id],
            // 'SELECT * FROM `tagging_tags`',
            //  + 'AND `taggable_type` = "App\\\\manga"',
            function (err, results, fields) {
              // client.setex(genreRedisKey, 3600, JSON.stringify(results))
              // return res.json(results);
              return res.redirect('/genre/all')
            });
          connection.end();
        // }
      // })
    } catch (error) {
      res.json(error);
    }
  })
})
module.exports = router;