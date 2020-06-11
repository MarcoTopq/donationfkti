'use strict'
const Sequelize = require('sequelize');
const db = require('../bin/index')
const Gallerys = db.define('gallerys', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.STRING,
  },
  created_at: Sequelize.TIME,
  updated_at: Sequelize.TIME,
//   isDeleted: Sequelize.BOOLEAN,
}, {
  paranoid: false,
  timestamps: false,
});

Gallerys.sync();

module.exports = Gallerys;