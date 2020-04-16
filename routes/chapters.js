'use strict'
var express = require('express');
var router = express.Router();
var Chapters = require('../models/chapters');
var Pictures = require('../models/pictures')
var Mangas = require('../models/mangas');
const redis = require('redis');
const sequelize = require('sequelize');
const client = redis.createClient(6379);
// const {
//   Op
// } = require('sequelize')
// var cache = require('express-redis-cache')();

router.get('/', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mangaRedisKey = 'countchapt';
      return client.get(mangaRedisKey, async (err, manga) => {
        if (manga) {
          return res.json(JSON.parse(manga))
        } else {
          var chapter = await Chapters.findAll({
            attributes: ['id', [sequelize.fn('count', sequelize.col('id')), 'count']],
          })
        }
        client.setex(mangaRedisKey, 600, JSON.stringify(chapter))
        return res.json(chapter)
      })
    } catch (error) {
      res.json(error)
    }
  })
})

router.get('/all', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      var chapter = await Chapters.findAll({
        attributes: ['id', [sequelize.fn('count', sequelize.col('id')), 'count']],
      })
      return res.json(chapter)
    } catch (error) {
      res.json(error)
    }
  })
})

router.get('/del', async (req, res) => {
  try {
    const mangaRedisKey = 'countchapt';
    client.DEL(mangaRedisKey);
    return res.json('ok')
  } catch (error) {
    return res.json(error);
  }
})

router.get('/hots', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = await Chapters.findAll({
        limit: 12,
        order: [
          ['updated_at', 'DESC']
        ]
      })
      let hots = await Promise.all(order.map(async hot => {
        let order_obj = JSON.parse(JSON.stringify(hot));
        let mangas = await Mangas.findAll({
          where: {
            id: order_obj.manga_id
          }
        })
        let pictures = await Pictures.findAll({
          where: {
            'picture_id': order_obj.manga_id,
            'picture_type': 'App\\manga'
          }
        })
        order_obj.pictures = pictures;
        order_obj.mangas = mangas;
        return order_obj;
      }))
      return res.json(hots);
    } catch (error) {
      res.json(error);
    }
  })
})

router.get('/update', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mangaRedisKey = 'update';
      return client.get(mangaRedisKey, async (err, manga) => {
        if (manga) {
          return res.json(JSON.parse(manga))
        } else {
          let orders = await Mangas.findAll({
            order: [
              ['created_at', 'DESC']
            ],
            limit: 20,
          })
          let hots = await Promise.all(orders.map(async hot => {
            let orders_obj = JSON.parse(JSON.stringify(hot));

            let chapters = await Chapters.findOne({
              where: {
                manga_id: orders_obj.id
              },
              order: [
                ['created_at', 'DESC']
              ],
            })
            let pictures = await Pictures.findOne({
              where: {
                'picture_id': orders_obj.id,
                'picture_type': 'App\\manga'
              }
            })
            orders_obj.pictures = pictures;
            orders_obj.chapters = chapters;
            return orders_obj;
          }))
          client.setex(mangaRedisKey, 1200, JSON.stringify(hots))
          return res.json(hots);
        }
      })
    } catch (error) {
      res.json(error);
    }
  })
})

router.get('/update-non-reshare', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mangaRedisKey = 'update-non-reshare';
      return client.get(mangaRedisKey, async (err, manga) => {
        if (manga) {
          return res.json(JSON.parse(manga))
        } else {
          let orders = await Mangas.findAll({
            where: {
              'statusshare': 'nonreshare'
            },
            order: [
              ['created_at', 'DESC']
            ],
            limit: 20,
          })
          let hots = await Promise.all(orders.map(async hot => {
            let orders_obj = JSON.parse(JSON.stringify(hot));
            let chapters = await Chapters.findOne({
              where: {
                manga_id: orders_obj.id
              },
              order: [
                ['created_at', 'DESC']
              ],
            })
            let pictures = await Pictures.findOne({
              where: {
                'picture_id': orders_obj.id,
                'picture_type': 'App\\manga'
              }
            })
            orders_obj.pictures = pictures;
            orders_obj.chapters = chapters;
            return orders_obj;
          }))
          client.setex(mangaRedisKey, 1200, JSON.stringify(hots))
          return res.json(hots);
        }
      })
    } catch (error) {
      res.json(error);
    }
  })
})

router.get('/update-reshare', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mangaRedisKey = 'update-reshare';
      return client.get(mangaRedisKey, async (err, manga) => {
        if (manga) {
          return res.json(JSON.parse(manga))
        } else {
          let orders = await Mangas.findAll({
            where: {
              'statusshare': 'reshare'
            },
            order: [
              ['created_at', 'DESC']
            ],
            limit: 20,
          })
          let hots = await Promise.all(orders.map(async hot => {
            let orders_obj = JSON.parse(JSON.stringify(hot));
            let chapters = await Chapters.findOne({
              where: {
                manga_id: orders_obj.id
              },
              order: [
                ['created_at', 'DESC']
              ],
            })
            let pictures = await Pictures.findOne({
              where: {
                'picture_id': orders_obj.id,
                'picture_type': 'App\\manga'
              }
            })
            orders_obj.pictures = pictures;
            orders_obj.chapters = chapters;
            return orders_obj;
          }))
          client.setex(mangaRedisKey, 1200, JSON.stringify(hots))
          return res.json(hots);
        }
      })
    } catch (error) {
      res.json(error);
    }
  })
})

router.get('/update-non-r18', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mangaRedisKey = 'update-non-r18';
      return client.get(mangaRedisKey, async (err, manga) => {
        if (manga) {
          return res.json(JSON.parse(manga))
        } else {
          let orders = await Mangas.findAll({
            where: {
              'statusage': 'non-r18'
            },
            order: [
              ['created_at', 'DESC']
            ],
            limit: 20,
          })
          let hots = await Promise.all(orders.map(async hot => {
            let orders_obj = JSON.parse(JSON.stringify(hot));
            let chapters = await Chapters.findOne({
              where: {
                manga_id: orders_obj.id
              },
              order: [
                ['created_at', 'DESC']
              ],
            })
            let pictures = await Pictures.findOne({
              where: {
                'picture_id': orders_obj.id,
                'picture_type': 'App\\manga'
              }
            })
            orders_obj.pictures = pictures;
            orders_obj.chapters = chapters;
            return orders_obj;
          }))
          client.setex(mangaRedisKey, 1200, JSON.stringify(hots))
          return res.json(hots);
        }
      })
    } catch (error) {
      res.json(error);
    }
  })
})

router.get('/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    var Id = req.params.id;
    try {
      var chapters = await Chapters.findAll({
        where: {
          manga_id: Id
        },
      });
      let chapt = await Promise.all(chapters.map(async hot => {
        let chapt_obj = JSON.parse(JSON.stringify(hot));
        let count = await Pictures.findAll({
          where: {
            picture_id: chapt_obj.id,
            picture_type: 'App\\chapter'
          },
          attributes: ['id', [sequelize.fn('count', sequelize.col('id')), 'count']],
        })
        var manga = await Mangas.findOne({
          where: {
            id: Id
          }
        });
        chapt_obj.count = count;
        chapt_obj.manga = manga;
        return chapt_obj;
      }));
      return res.json(chapt);
    } catch (error) {
    }
  })
})


router.put('/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    var Id = req.params.id;
    let chapt = req.query.chapt;
    try {
      var chapter = await Chapters.findOne({
        where: {
          manga_id: Id,
          chapter: chapt
        }
      })
      if (chapter) {
        await Chapters.update({
          views: chapter.views + 1,
        }, {
          where: {
            id: chapter.id,
          }
        })
        var update = await Chapters.findOne({
          where: {
            id: chapter.id
          }
        })
        return res.json(update)
      }
      // return res.json(chapter);
    } catch (error) {
      res.json(error)
    }
  })
})

module.exports = router;