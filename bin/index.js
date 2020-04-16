var Sequelize = require('sequelize');
const redis = require('redis');
const client = redis.createClient();
var db = new Sequelize({
  database: 'sql12333784', 
  username: 'sql12333784', 
  password: 'mCL39mQGpV',
  host: 'sql12.freemysqlhosting.net',
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