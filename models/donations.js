'use strict'
const Sequelize = require('sequelize');
const db = require('../bin/index')
const Donations = db.define('donations', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    campaign_id: {
        type: Sequelize.INTEGER,
    },
    donation: {
        type: Sequelize.INTEGER,
    },
    created_at: Sequelize.TIME,
    updated_at: Sequelize.TIME,
    //   isDeleted: Sequelize.BOOLEAN,
}, {
    paranoid: false,
    timestamps: false,
});

Donations.sync();

module.exports = Donations;