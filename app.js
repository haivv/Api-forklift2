var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//swagger
app.use(express.urlencoded({ extended: true }));
const swaggerOptions = {
    swaggerDefinition:{
        info:{
            title: 'Volvo - API',
            version: '1.0.0'
        }
    },
    apis: ['app.js'],
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * @swagger
 * /check-login:
 *  post:
 *      description: "Check login. <br/> Output url: /check-login/output <br/> Access Token 만료: 30조; Refresh Token 만료: 1일; <br/> 로그인  30조 후 accessToken 재발급하기 위해 /accessTokenAgain에 접속해야 한다" 
 *      parameters:
 *      - name: txtuser
 *        description: 유저
 *        in: formData
 *        required: true
 *        type: string
 *      - name: txtpass
 *        description: 비밀번호
 *        in: formData
 *        type: string
 *      responses:
 *        '200':
 *          description: "Login successful"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "login success"
 *        '400':
 *          description: "Login fail"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "login fail"
 */

/**
 * @swagger
 * /user:
 *  get:
 *      description: "Get all user" 
 *      responses:
 *        '200':
 *          description: "회원명단"
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                idAcc:
 *                  type: integer
 *                  description: IdAcc
 *                username:
 *                  type: string
 *                  description: username
 *                name:
 *                  type: string
 *                  description: 이름
 *                job:
 *                  type: string
 *                  description: 작업

 *           
 */

/**
 * @swagger
 * /user-add:
 *  post:
 *      description: "Add user. <br/> Output url: /user-add/output" 
 *      parameters:
 *      - name: txtname
 *        description: 이름
 *        in: formData
 *        type: string
 *      - name: txtuser
 *        description: 유저네임
 *        in: formData
 *        type: string
 *      - name: txtpass
 *        description: 비밀번호
 *        in: formData
 *        type: string
 *      - name: txtjob
 *        description: 작업
 *        in: formData
 *        type: string
 *      responses:
 *        '200':
 *          description: "회원을 추가하였습니다"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "회원을 추가하였습니다"
 *        '400':
 *          description: "Error: Bad Request. 회원등록은 이미 사용 중인 ID입니다"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "회원등록은 이미 사용 중인 ID입니다"        
 *        '304':
 *          description: "accessToken is expired"
 *          schema:
 *           type: object
 *           example: accessToken is expired
 *        '600':
 *          description: "login required"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "login required"  
 */

/**
 * @swagger
 * /accessTokenCheck:
 *  get:
 *      description: "accessToken 확인" 
 *      responses:
 *        '200':
 *          description: "accessToken 존제"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "accessToken is defined"
 *        '201':
 *          description: "accessToken 만료가 지났다"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "accessToken is expired"
 *        '500':
 *          description: "Error: Internal Server Error"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "accessToken is not defined"
 *           
 */

/**
 * @swagger
 * /accessTokenAgain:
 *  get:
 *      description: "accessToken 재발급" 
 *      responses:
 *        '200':
 *          description: "accessToken 재발급했다"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "accessToken 재발급했다"
 *        '500':
 *          description: "Error: Internal Server Error"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "refreshToken is not defined"
 *           
 */
 /**
 * @swagger
 * /logout:
 *  get:
 *      description: "Logout" 
 *      responses:
 *        '200':
 *          description: "Logout"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "login required"
 *           
 */
module.exports = app;
