'use strict'
var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
// var cache = require('express-redis-cache')();
const redis = require('redis');
const client = redis.createClient(6379);
/* GET home page. */
var multer = require('multer');
var path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
    + '-' + Date.now() +
    path.extname(file.originalname);
  }
});
var upload = multer({
  storage: storage
})

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Mangadono'
  });
});

// router.get('/discuss/:id', function (req, res, next) {
//   res.render('discuss');
// });

// router.get('/upload', function (req, res) {
//   var pass = req.query.password
//   if (pass == 'mentulan') {
//     res.render('upload', {
//       title: 'Mangadono'
//     });
//   } else {
//     res.redirect('/')
//   }
// });

// router.get('/upload-non-r18', function (req, res) {
//   var pass = req.query.password
//   if (pass == 'mentulan') {
//     res.render('upload-non-r18', {
//       title: 'Mangadono'
//     });
//   } else {
//     res.redirect('/')
//   }
// });

// router.get('/statusage', async (req, res) => {
//   var pass = req.query.password
//   return new Promise(async (resolve, reject) => {
//     try {
//       const mangaRedisKey = 'manga-non-r18';
//       // Try fetching the result from Redis first in case we have it cached
//       // return client.get(mangaRedisKey, async (err, manga) => {
//       //   // If that key exists in Redis store
//       //   if (manga) {
//       //    return res.render('statusage', { mangas: JSON.parse(manga) })
//       //   } else {
//       if (pass == 'mentulan') {

//         var mangas = await Mangas.findAll();
//         let alls = await Promise.all(mangas.map(async all => {
//           let mangas_obj = JSON.parse(JSON.stringify(all));
//           let pictures = await Pictures.findAll({
//             where: {
//               'picture_id': mangas_obj.id,
//               'picture_type': 'App\\manga'
//             }
//           })
//           mangas_obj.pictures = pictures;
//           return mangas_obj;
//         }));
//         // client.setex(mangaRedisKey, 3600, JSON.stringify(alls))
//         return res.render('statusage', {
//           mangas: alls
//         })
//         // .then(data => (res.json(data)))
//         // .catch(err => res.status(400).json(err))
//         //   }
//         // })
//       } else {
//         res.redirect('/')
//       }
//     } catch (error) {
//       res.json(error)
//     }
//   })
// })

// router.get('/statusapp', async (req, res) => {
//   var pass = req.query.password
//   return new Promise(async (resolve, reject) => {
//     try {
//       const mangaRedisKey = 'manga-non-r18';
//       // Try fetching the result from Redis first in case we have it cached
//       // return client.get(mangaRedisKey, async (err, manga) => {
//       //   // If that key exists in Redis store
//       //   if (manga) {
//       //    return res.render('statusage', { mangas: JSON.parse(manga) })
//       //   } else {
//       if (pass == 'mentulan') {

//         var mangas = await Mangas.findAll();
//         let alls = await Promise.all(mangas.map(async all => {
//           let mangas_obj = JSON.parse(JSON.stringify(all));
//           let pictures = await Pictures.findAll({
//             where: {
//               'picture_id': mangas_obj.id,
//               'picture_type': 'App\\manga'
//             }
//           })
//           mangas_obj.pictures = pictures;
//           return mangas_obj;
//         }));
//         // client.setex(mangaRedisKey, 3600, JSON.stringify(alls))
//         return res.render('statusapp', {
//           mangas: alls
//         })
//         // .then(data => (res.json(data)))
//         // .catch(err => res.status(400).json(err))
//         //   }
//         // })
//       } else {
//         res.redirect('/')
//       }
//     } catch (error) {
//       res.json(error)
//     }
//   })
// })

// router.get('/statusshare', async (req, res) => {
//   var pass = req.query.password
//   return new Promise(async (resolve, reject) => {
//     try {
//       const mangaRedisKey = 'manga-non-r18';
//       // Try fetching the result from Redis first in case we have it cached
//       // return client.get(mangaRedisKey, async (err, manga) => {
//       //   // If that key exists in Redis store
//       //   if (manga) {
//       //    return res.render('statusage', { mangas: JSON.parse(manga) })
//       //   } else {
//       if (pass == 'mentulan') {

//         var mangas = await Mangas.findAll();
//         let alls = await Promise.all(mangas.map(async all => {
//           let mangas_obj = JSON.parse(JSON.stringify(all));
//           let pictures = await Pictures.findAll({
//             where: {
//               'picture_id': mangas_obj.id,
//               'picture_type': 'App\\manga'
//             }
//           })
//           mangas_obj.pictures = pictures;
//           return mangas_obj;
//         }));
//         // client.setex(mangaRedisKey, 3600, JSON.stringify(alls))
//         return res.render('statusshare', {
//           mangas: alls
//         })
//         // .then(data => (res.json(data)))
//         // .catch(err => res.status(400).json(err))
//         //   }
//         // })
//       } else {
//         res.redirect('/')
//       }
//     } catch (error) {
//       res.json(error)
//     }
//   })
// })

// router.get('/login', function (req, res, next) {
//   res.render('login');
// });

// router.post('/login', function (req, res, next) {

//   // you might like to do a database look-up or something more scalable here
//   if (req.body.username && req.body.username === 'user' && req.body.password && req.body.password === 'pass') {
//     req.session.authenticated = true;
//     res.redirect('/');
//     next();
//   } else {
//     // req.flash('error', 'Username and password are incorrect');
//     res.redirect('/login');
//   }

// });

// router.get('/logout', function (req, res, next) {
//   delete req.session.authenticated;
//   res.redirect('/');
// });

// router.post('/upload', upload.single('mdo.apk'), (req, res, next) => {
//   const file = req.file
//   if (!file) {
//     const error = new Error('Please upload a file')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//   // res.send(file)
//   res.render('index', {
//     title: 'Mangadono'
//   })
// });

// router.post('/upload-non-r18', upload.single('mdo-non-r18.apk'), (req, res, next) => {
//   const file = req.file
//   if (!file) {
//     const error = new Error('Please upload a file')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//   // res.send(file)
//   res.render('index', {
//     title: 'Mangadono'
//   })
// });

// router.get('/download', function (req, res) {
//   const file = `${__dirname}/upload-folder/mdo.apk`;
//   res.download(file); // Set disposition and send it.
// });

// router.get('/download-non-r18', function (req, res) {
//   const file = `${__dirname}/upload-folder/mdo-non-r18.apk`;
//   res.download(file); // Set disposition and send it.
// });

// router.get('/version', async (req, res) => {
//   try {
//     var version = await Version.findAll();
//     return res.json(version);
//   } catch (error) {
//     res.json(error);
//   }
// })

// router.get('/favs/', async (req, res) => {
//   var pass = req.query.password
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (pass == 'mentulan') {
//         var mangas = await Mangas.findAll({
//           order: [
//             ['favorite', 'DESC']
//           ],
//           limit: 20,
//         });
//         let alls = await Promise.all(mangas.map(async all => {
//           let mangas_obj = JSON.parse(JSON.stringify(all));
//           let pictures = await Pictures.findAll({
//             where: {
//               'picture_id': mangas_obj.id,
//               'picture_type': 'App\\manga'
//             }
//           })
//           mangas_obj.pictures = pictures;
//           return mangas_obj;
//         }));
//         // return res.json(alls)
//         return res.render('fav', {
//           favs: alls
//         })
//       } else {
//         res.redirect('/')
//       }
//     } catch (error) {
//       res.json(error)
//     }
//   })
// })

// router.get('/fav-non-r18', async (req, res) => {
//   var pass = req.query.password
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (pass == 'mentulan') {
//         var mangas = await Mangas.findAll({
//           where: {
//             'statusage': 'non-r18'
//           },
//           order: [
//             ['favorite', 'DESC']
//           ],
//           limit: 20,
//         });
//         let alls = await Promise.all(mangas.map(async all => {
//           let mangas_obj = JSON.parse(JSON.stringify(all));
//           let pictures = await Pictures.findAll({
//             where: {
//               'picture_id': mangas_obj.id,
//               'picture_type': 'App\\manga'
//             }
//           })
//           mangas_obj.pictures = pictures;
//           return mangas_obj;
//         }));
//         return res.json(alls)
//       } else {
//         res.redirect('/')
//       }
//     } catch (error) {
//       res.json(error)
//     }
//   })
// })

// router.get('/views', async (req, res) => {
//   var pass = req.query.password
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (pass == 'mentulan') {
//         var mangas = await Mangas.findAll({
//           order: [
//             ['views', 'DESC']
//           ],
//           limit: 20,
//         });
//         let alls = await Promise.all(mangas.map(async all => {
//           let mangas_obj = JSON.parse(JSON.stringify(all));
//           let pictures = await Pictures.findAll({
//             where: {
//               'picture_id': mangas_obj.id,
//               'picture_type': 'App\\manga'
//             }
//           })
//           mangas_obj.pictures = pictures;
//           return mangas_obj;
//         }));
//         // return res.json(alls)
//         return res.render('views', {
//           views: alls
//         })
//       } else {
//         res.redirect('/')
//       }
//     } catch (error) {
//       res.json(error)
//     }
//   })
// })

// router.get('/views-non-r18', async (req, res) => {
//   var pass = req.query.password
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (pass == 'mentulan') {
//         var mangas = await Mangas.findAll({
//           where: {
//             'statusage': 'non-r18'
//           },
//           order: [
//             ['views', 'DESC']
//           ],
//           limit: 20,
//         });
//         let alls = await Promise.all(mangas.map(async all => {
//           let mangas_obj = JSON.parse(JSON.stringify(all));
//           let pictures = await Pictures.findAll({
//             where: {
//               'picture_id': mangas_obj.id,
//               'picture_type': 'App\\manga'
//             }
//           })
//           mangas_obj.pictures = pictures;
//           return mangas_obj;
//         }));
//         return res.json(alls)
//       } else {
//         res.redirect('/')
//       }
//     } catch (error) {
//       res.json(error)
//     }
//   })
// })

// router.get('/chapters-views', async (req, res) => {
//   var pass = req.query.password
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (pass == 'mentulan') {
//         const mangaRedisKey = 'chapters-views';
//         return client.get(mangaRedisKey, async (err, manga) => {
//           if (manga) {
//             // return res.json(JSON.parse(manga))
//             return res.render('chapters-views', {
//               chapters: JSON.parse(manga)
//             })
//           } else {
//             let order = await Chapters.findAll({
//               limit: 100,
//               order: [
//                 ['views', 'DESC']
//               ]
//             })
//             let hots = await Promise.all(order.map(async hot => {
//               let order_obj = JSON.parse(JSON.stringify(hot));
//               let mangas = await Mangas.findAll({
//                 where: {
//                   id: order_obj.manga_id
//                 }
//               })
//               let pictures = await Pictures.findAll({
//                 where: {
//                   'picture_id': order_obj.manga_id,
//                   'picture_type': 'App\\manga'
//                 }
//               })
//               order_obj.pictures = pictures;
//               order_obj.mangas = mangas;
//               return order_obj;
//             }))
//             client.setex(mangaRedisKey, 1200, JSON.stringify(hots))
//             // return res.json(hots);
//             return res.render('chapters-views', {
//               chapters: hots
//             })
//           }
//         })
//       } else {
//         res.redirect('/')
//       }
//     } catch (error) {
//       res.json(error);
//     }
//   })
// })

module.exports = router;