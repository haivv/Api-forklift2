const express = require('express');
const router = express.Router();

// Swagger 설정
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Volvo - API',
      version: '1.0.0'
    }
  },
  apis: ['server.js', './lib/swagger.js'], // 이 경로들은 실제 프로젝트의 경로에 따라 조정해야 합니다.
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Swagger UI를 사용하는 라우터 설정
router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(swaggerDocs));

module.exports = router;