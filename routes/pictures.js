'use strict'
var express = require('express');
var router = express.Router();
var Pictures = require('../models/pictures');
const sequelize = require('sequelize');
var Chapters = require('../models/chapters');
const Op = sequelize.Op;

router.get('/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    let Id = req.params.id;
    let chapt = req.query.chapt;
    try {
      let chapters = await Chapters.findOne({
        where: {
          manga_id: Id,
          chapter: chapt
        }
      });
      let pictures = await Pictures.findAll({
        where: {
          picture_id: chapters.id,
          picture_type: 'App\\chapter'
        },
      })
      console.log(chapters)
      let pict = await Promise.all(pictures.map(async hot => {
        let pict_obj = JSON.parse(JSON.stringify(hot));
        // let count = await Pictures.findAll({
        //   where: {
        //     picture_id: pict_obj.picture_id,
        //     picture_type: 'App\\chapter'
        //   },
        //   attributes: ['id', [sequelize.fn('count', sequelize.col('id')), 'count']],
        // })
        var all =await Chapters.findAll({
          where: {
            manga_id: Id
          },
          attributes: ['chapter'],
          order: [
            ['created_at', 'DESC']
          ],
        });
        let chapter = await Chapters.findAll({
          where: {
            id: pict_obj.picture_id,
            chapter: chapters.chapter
          }
        });
        pict_obj.all = all;
        pict_obj.chapters = chapter;
        return pict_obj;
      }));

      return res.json(pict);
    } catch (error) {
      res.json(error);
    }
  })
})

router.get('/prev/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    let Id = req.params.id;
    let chapt = req.query.chapt;
    try {
      let chapters = await Chapters.findOne({
        where: {
          manga_id: Id,
          chapter: { [Op.lt]: parseInt(chapt) }
        },
        // limit: 1,
        order: [
          ['chapter', 'DESC']
        ]
      });
      let pictures = await Pictures.findAll({
        where: {
          picture_id: chapters.id,
          picture_type: 'App\\chapter'
        },
      })
      console.log(chapters)
      let pict = await Promise.all(pictures.map(async hot => {
        let pict_obj = JSON.parse(JSON.stringify(hot));
        let count = await Pictures.findAll({
          where: {
            picture_id: pict_obj.picture_id,
            picture_type: 'App\\chapter'
          },
          attributes: ['id', [sequelize.fn('count', sequelize.col('id')), 'count']],
        })
        let chapter = await Chapters.findAll({
          where: {
            id: pict_obj.picture_id,
            chapter: chapters.chapter
          }
        });
        pict_obj.count = count;
        pict_obj.chapters = chapter;
        return pict_obj;
      }));

      return res.json(pict);
    } catch (error) {
      res.json(error);
    }
  })
})

router.get('/next/:id', async (req, res) => {
  return new Promise(async (resolve, reject) => {
    let Id = req.params.id;
    let chapt = req.query.chapt;
    try {
      let chapters = await Chapters.findOne({
        where: {
          manga_id: Id,
          chapter: { [Op.gt]: parseInt(chapt) }
        },
        // limit: 10,
        // order: [
        //   ['chapter', 'asc']
        // ]
      });
      let pictures = await Pictures.findAll({
        where: {
          picture_id: chapters.id,
          picture_type: 'App\\chapter'
        },
      })
      console.log(chapters)
      let pict = await Promise.all(pictures.map(async hot => {
        let pict_obj = JSON.parse(JSON.stringify(hot));
        let count = await Pictures.findAll({
          where: {
            picture_id: pict_obj.picture_id,
            picture_type: 'App\\chapter'
          },
          attributes: ['id', [sequelize.fn('count', sequelize.col('id')), 'count']],
        })
        let chapter = await Chapters.findAll({
          where: {
            id: pict_obj.picture_id,
            chapter: chapters.chapter
          }
        });
        pict_obj.count = count;
        pict_obj.chapters = chapter;
        return pict_obj;
      }));

      return res.json(pict);
    } catch (error) {
      res.json(error);
    }
  })
})


module.exports = router;