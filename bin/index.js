var Sequelize = require('sequelize');
const redis = require('redis');
const client = redis.createClient();
var db = new Sequelize({
  database: 'kDECKsmyE3', 
  username: 'kDECKsmyE3', 
  password: 'qe3Cr11fEf',
  host: 'remotemysql.com',
  port: 3306,
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


  client.on('error', function (err) {
    console.log('Error ' + err)
  })
module.exports = db
// , connection;


// You have successfully created a new database. The details are below.

// Username: kDECKsmyE3

// Database name: kDECKsmyE3

// Password: qe3Cr11fEf

// Server: remotemysql.com

// Port: 3306