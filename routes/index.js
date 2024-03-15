require('dotenv').config(); //load environment parameters from .env file
var express = require('express');
var router = express.Router();
var database = require('../database');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const fs = require('fs');

const accessTokenExp = '30s'; //  Access Token 만료
const refreshTokenExp = '1d'; //  Refresh Token 만료

const activeTokens = new Set();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* check login. */





router.post('/check-login', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const new_password = crypto.createHash('md5').update(password).digest('hex');
  const query = `SELECT * FROM account WHERE username="${username}" AND password="${new_password}"`;

  database.query(query, function (error, data) {
    if (error) {
      throw error;
    } else {
      var total_records = data.length;
      if (total_records > 0) {
        //save message to json file
        const message = { message: 'login success' };
        const jsonMessage = JSON.stringify(message);
        fs.writeFile('output-check-login.json', jsonMessage, (err) => { });

        // Create token
        const payload = { username };
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        accessToken = jwt.sign(payload, secretKey, { expiresIn: accessTokenExp });
        refreshToken = jwt.sign(payload, secretKey, { expiresIn: refreshTokenExp });
        activeTokens.add(accessToken);
        activeTokens.add(refreshToken);
        res.status(200).json({ message: 'login success' });
        //res.json({ message: 'login success' });
      } else {
        const message = { message: 'login fail' };
        const jsonMessage = JSON.stringify(message);
        fs.writeFile('output-check-login.json', jsonMessage, (err) => { });
        res.status(400).json({ message: 'login fail' });
        //res.json({ message: 'login fail' });
      }
    }
  });
});

router.get('/check-login/output', function (req, res, next) {
  const filePath = 'output-check-login.json';
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return;
    }
    const jsonData = JSON.parse(data);
    res.send(jsonData)

  });
});

// get user

router.get('/user', (req, res) => {
  //res.send(`Access Token is ok - Username: ${username}`);
  //res.json({ message: 'accessToken is existed' });

  var query1 = `SELECT * FROM account `;
  database.query(query1, function (error, data) {
    if (error) {
      throw error;
    }
    else {
      var total_records = data.length;
      //console.log(total_records);

      //console.log(JSON.stringify(data));
      res.json(data);
    }
  });//end database.query(query1)




});


router.post('/user-add', (req, res) => {
  if (activeTokens.size != 0) {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    jwt.verify(accessToken, secretKey, (err, decoded) => {
      if (err) {
        res.send("Access Token is expired");
      } else {
        const { txtname, txtuser, txtpass, txtjob } = req.body;
        const new_password = crypto.createHash('md5').update(txtpass).digest('hex');
        var query1 = `SELECT * FROM account WHERE username="${txtuser}"`;

        database.query(query1, function (error, data) {
          if (error) {
            throw error;
          }
          else {
            var total_records = data.length;
            if (total_records == 0) {
              console.log(total_records);

              var queryGetIdAcc = "SELECT * FROM account ORDER BY idAcc DESC LIMIT 1";
              database.query(queryGetIdAcc, function (error, dataGetIdAcc) {
                if (error) {
                  throw error;
                }
                else {
                  var idAcc = dataGetIdAcc[0].idAcc + 1;
                  //console.log(idAcc);
                  var query3 = `INSERT INTO account (idAcc, username, password, name, job) VALUES ("${idAcc}", "${txtuser}", "${new_password}", "${txtname}", "${txtjob}")  `;
                  database.query(query3, function (error) {
                    if (error) {
                      throw error;
                    }
                    else {
                      const message = { message: '회원을 추가하였습니다' };
                      const jsonMessage = JSON.stringify(message);
                      fs.writeFile('output-user-add.json', jsonMessage, (err) => { });
                      res.status(200).json({ message: '회원을 추가하였습니다' });
                      //res.redirect('/');
                    }
                  });
                }
              });//end database.query(queryGetIdAcc)
            }
            else {

              const message = { message: '회원등록은 이미 사용 중인 ID입니다' };
              const jsonMessage = JSON.stringify(message);
              fs.writeFile('output-user-add.json', jsonMessage, (err) => { });
              res.status(400).json({ message: '회원등록은 이미 사용 중인 ID입니다' });
            }
          }
        });//end database.query(query1)
      }
    });//end jwt
  }
  else {
    res.status(600).json({ message: 'login required' });
  }
});

router.get('/user-add/output', function (req, res, next) {
  const filePath = 'output-user-add.json';
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return;
    }
    const jsonData = JSON.parse(data);
    res.send(jsonData)

  });
});


router.get('/accessTokenCheck', (req, res) => {
  const secretKey = process.env.ACCESS_TOKEN_SECRET;
  jwt.verify(accessToken, secretKey, (err, decoded) => {
    if (err) {
      res.status(201).json({ message: 'accessToken is expired' });

    } else {
      const username = decoded.username;
      //res.send(`Access Token is ok - Username: ${username}`);
      res.json({ message: 'accessToken is existed' });
    }
  });
});


router.get('/accessTokenAgain', (req, res) => {
  const secretKey = process.env.ACCESS_TOKEN_SECRET;
  jwt.verify(refreshToken, secretKey, (err, decoded) => {
    if (err) {
      res.json({ message: 'Invalid access token' });
    } else {
      const username = decoded.username;
      //Create accessToken again
      const payload = { username };
      const secretKey = process.env.ACCESS_TOKEN_SECRET;
      accessToken = jwt.sign(payload, secretKey, { expiresIn: accessTokenExp });
      res.json({ message: 'accessToken 재발급했다' });
    }
  });
});


router.get('/logout', (req, res) => {
  const tokensArray = Array.from(activeTokens);
  // res.json(tokensArray);
  activeTokens.clear();
  res.status(200).json({ message: 'login required' });

});



module.exports = router;
