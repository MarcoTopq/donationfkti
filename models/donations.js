'use strict'
const Sequelize = require('sequelize');
const db = require('../bin/index')
const Donation = db.define('donation', {
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
    id_campaign: {
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

Donation.sync();

module.exports = Donation;