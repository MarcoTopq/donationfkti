'use strict'
const Sequelize = require('sequelize');
const db = require('../bin/index')
const Campaigns = db.define('campaigns', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fundraiser: {
    type: Sequelize.STRING,
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
  current_donation: {
    type: Sequelize.INTEGER,
  },
  total_donation: {
    type: Sequelize.INTEGER,
  },
  time_limit: {
    type: Sequelize.DATE,
  },
  created_at: Sequelize.TIME,
  updated_at: Sequelize.TIME,
//   isDeleted: Sequelize.BOOLEAN,
}, {
  paranoid: false,
  timestamps: false,
});

Campaigns.sync();

module.exports = Campaigns;