const jwt = require('jsonwebtoken');
var config = require('../config/index');

// let jwt = require('jsonwebtoken');
// const config = require('./config.js');

// let checkToken = (req, res, next) => {
//     let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
//     //   console.log(token)
//     //   if (token.startsWith('Bearer ')) {
//     //     // Remove Bearer from string
//     //     token = token.slice(7, token.length);
//     //     console.log(token)
//     //   }

//     if (token) {
//         token = token.slice(8, token.length);
//         console.log(token)
//         jwt.verify(token, config.secret, (err, decoded) => {
//             if (err) {
//                 console.log(err)
//                 return res.json({
//                     success: false,
//                     message: 'Token is not valid'
//                 });
//             } else {
//                 console.log(decoded)
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         return res.json({
//             success: false,
//             message: 'Auth token is not supplied'
//         });
//     }
// };

// module.exports = {
//     checkToken: checkToken
// }


module.exports = {
    checkToken: (req, res, next) => {
        try {
            console.log(req.headers)
            var token = req.headers.authorization;
            console.log(token)
            var decoded = jwt.verify(token, config.secret);
            console.log(decoded)
            req.user = decoded;
            next();
        } catch (err) {
            console.log(err)
            // res.status(401).json({
            //     message: 'Token is Invalid'
            // });
            res.redirect('/login')
        }
    },
    isAuthorized: (req, res, next) => {
        if (req.body.role == 'admin') {
            next();
        } else {
            // res.status(401).json({
            //     message: 'User Not Authorized'
            // });
            res.redirect('/login')
        }
    },
};