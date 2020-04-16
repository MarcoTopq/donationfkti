'use strict'
var express = require('express');
var router = express.Router();
var Mangas = require('../models/mangas');
var Chapters = require('../models/chapters');
var Pictures = require('../models/pictures')
// var cache = require('express-redis-cache')();
const redis = require('redis');
const client = redis.createClient(6379);

router.get('/', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mangaRedisKey = 'manga';
      // Try fetching the result from Redis first in case we have it cached
      return client.get(mangaRedisKey, async (err, manga) => {
        // If that key exists in Redis store
        if (manga) {
          return res.json(JSON.parse(manga));
        } else {
          var mangas = await Mangas.findAll();
          let alls = await Promise.all(mangas.map(async all => {
            let mangas_obj = JSON.parse(JSON.stringify(all));
            let pictures = await Pictures.findAll({
              where: {
                'picture_id': mangas_obj.id,
                'picture_type': 'App\\manga'
              }
            })
            mangas_obj.pictures = pictures;
            return mangas_obj;
          }));
          client.setex(mangaRedisKey, 3600, JSON.stringify(alls))
          return res.json(alls)
          // .then(data => (res.json(data)))
          // .catch(err => res.status(400).json(err))
        }
      })
    } catch (error) {
      res.json(error)
    }
  })
})

router.get('/non-r18', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mangaRedisKey = 'manga-non-r18';
      // Try fetching the result from Redis first in case we have it cached
      return client.get(mangaRedisKey, async (err, manga) => {
        // If that key exists in Redis store
        if (manga) {
          return res.json(JSON.parse(manga));
        } else {
          var mangas = await Mangas.findAll({
            where: {
              'statusage': 'non-r18'
            }
          });
          let alls = await Promise.all(mangas.map(async all => {
            let mangas_obj = JSON.parse(JSON.stringify(all));
            let pictures = await Pictures.findAll({
              where: {
                'picture_id': mangas_obj.id,
                'picture_type': 'App\\manga'
              }
            })
            mangas_obj.pictures = pictures;
            return mangas_obj;
          }));
          client.setex(mangaRedisKey, 3600, JSON.stringify(alls))
          return res.json(alls)
          // .then(data => (res.json(data)))
          // .catch(err => res.status(400).json(err))
        }
      })
    } catch (error) {
      res.json(error)
    }
  })
})

router.get('/fav', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      var mangas = await Mangas.findAll({
        order: [
          ['favorite', 'DESC']
        ],
        limit: 20,
      });
      let alls = await Promise.all(mangas.map(async all => {
        let mangas_obj = JSON.parse(JSON.stringify(all));
        let pictures = await Pictures.findAll({
          where: {
            'picture_id': mangas_obj.id,
            'picture_type': 'App\\manga'
          }
        })
        mangas_obj.pictures = pictures;
        return mangas_obj;
      }));
      return res.json(alls)
    } catch (error) {
      res.json(error)
    }
  })
})

router.get('/fav-non-r18', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      var mangas = await Mangas.findAll({
        where: {
          'statusage': 'non-r18'
        },
        order: [
          ['favorite', 'DESC']
        ],
        limit: 20,
      });
      let alls = await Promise.all(mangas.map(async all => {
        let mangas_obj = JSON.parse(JSON.stringify(all));
        let pictures = await Pictures.findAll({
          where: {
            'picture_id': mangas_obj.id,
            'picture_type': 'App\\manga'
          }
        })
        mangas_obj.pictures = pictures;
        return mangas_obj;
      }));
      return res.json(alls)
    } catch (error) {
      res.json(error)
    }
  })
})

router.get('/views', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      var mangas = await Mangas.findAll({
        order: [
          ['views', 'DESC']
        ],
        limit: 20,
      });
      let alls = await Promise.all(mangas.map(async all => {
        let mangas_obj = JSON.parse(JSON.stringify(all));
        let pictures = await Pictures.findAll({
          where: {
            'picture_id': mangas_obj.id,
            'picture_type': 'App\\manga'
          }
        })
        mangas_obj.pictures = pictures;
        return mangas_obj;
      }));
      return res.json(alls)
    } catch (error) {
      res.json(error)
    }
  })
})

router.get('/views-non-r18', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      var mangas = await Mangas.findAll({
        where: {
          'statusage': 'non-r18'
        },
        order: [
          ['views', 'DESC']
        ],
        limit: 20,
      });
      let alls = await Promise.all(mangas.map(async all => {
        let mangas_obj = JSON.parse(JSON.stringify(all));
        let pictures = await Pictures.findAll({
          where: {
            'picture_id': mangas_obj.id,
            'picture_type': 'App\\manga'
          }
        })
        mangas_obj.pictures = pictures;
        return mangas_obj;
      }));
      return res.json(alls)
    } catch (error) {
      res.json(error)
    }
  })
})

router.get('/:id', async (req, res) => {
  var Id = req.params.id;
  await Mangas.findOne({
    where: {
      id: Id,
    }
  })
    .then(data => (res.json(data)))
    .catch(err => res.status(400).json(err))
})

router.put('/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    var Id = req.params.id;
    try {
      var mangas = await Mangas.findOne({
        where: {
          id: Id
        }
      })
      if (mangas) {
        await Mangas.update({
          views: mangas.views + 1,
        }, {
          where: {
            id: Id,
          }
        })
        var update = await Mangas.findOne({
          where: {
            id: Id
          }
        })
        return res.json(update)
      }
      return res.json('not update');
    } catch (error) {
      res.json(error)
    }
  })
})

router.post('/statusage/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    var Id = req.params.id;
    var body = req.body;
    console.log(req.body)
    try {
      var mangas = await Mangas.findOne({
        where: {
          id: Id
        }
      })
      if (mangas) {
        await Mangas.update({
          statusage: body.statusage,
        }, {
          where: {
            id: Id,
          }
        })
        var update = await Mangas.findOne({
          where: {
            id: Id
          }
        })
        return res.redirect('/statusage/?password=mentulan')
      }
      return res.json('not update');
    } catch (error) {
      res.json(error)
    }
  })
})

router.post('/statusapp/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    var Id = req.params.id;
    var body = req.body;
    console.log(req.body)
    try {
      var mangas = await Mangas.findOne({
        where: {
          id: Id
        }
      })
      if (mangas) {
        await Mangas.update({
          statusapp: body.statusapp,
        }, {
          where: {
            id: Id,
          }
        })
        var update = await Mangas.findOne({
          where: {
            id: Id
          }
        })
        return res.redirect('/statusapp/?password=mentulan')
      }
      return res.json('not update');
    } catch (error) {
      res.json(error)
    }
  })
})

router.post('/statusshare/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    var Id = req.params.id;
    var body = req.body;
    console.log(req.body)
    try {
      var mangas = await Mangas.findOne({
        where: {
          id: Id
        }
      })
      if (mangas) {
        await Mangas.update({
          statusshare: body.statusshare,
        }, {
          where: {
            id: Id,
          }
        })
        var update = await Mangas.findOne({
          where: {
            id: Id
          }
        })
        return res.redirect('/statusshare/?password=mentulan')
      }
      return res.json('not update');
    } catch (error) {
      res.json(error)
    }
  })
})

router.put('/addfav/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    var Id = req.params.id;
    try {
      var mangas = await Mangas.findOne({
        where: {
          id: Id
        }
      })
      if (mangas) {
        await Mangas.update({
          favorite: mangas.favorite + 1,
        }, {
          where: {
            id: Id,
          }
        })
        var update = await Mangas.findOne({
          where: {
            id: Id
          }
        })
        return res.json(update)
      }
      return res.json('not update');
    } catch (error) {
      res.json(error)
    }
  })
})

router.put('/removefav/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    var Id = req.params.id;
    try {
      var mangas = await Mangas.findOne({
        where: {
          id: Id
        }
      })
      if (mangas) {
        await Mangas.update({
          favorite: mangas.favorite - 1,
        }, {
          where: {
            id: Id,
          }
        })
        var update = await Mangas.findOne({
          where: {
            id: Id
          }
        })
        return res.json(update)
      }
      return res.json('not update');
    } catch (error) {
      res.json(error)
    }
  })
})



module.exports = router;