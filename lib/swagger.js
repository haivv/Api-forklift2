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
 * /check-login:
 *  post:
 *      summary: "----- 2. -----  로그인"
 *      description: "Check login. <br/> Output url: /check-login/output <br/> Access Token 만료: 30조; Refresh Token 만료: 1일; <br/> 로그인  30조 후 accessToken 재발급하기 위해 /accessTokenAgain에 접속해야 한다" 
 *      parameters:
 *       - name: username
 *         description: "username"
 *         in: formData
 *         type: string
 *       - name: password
 *         description: "username"
 *         in: formData
 *         type: string
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
 * /notice_add:
 *   post:
 *     summary: "----- 2. -----  Add a notice"
 *     description: "Add a new notice" 
 *     parameters:
 *       - name: title
 *         description: "Title of the notice"
 *         in: formData
 *         type: string
 *       - name: category
 *         description: "Category of the notice"
 *         in: formData
 *         type: string
 *         enum:
 *           - op1
 *           - op2
 *           - op3
 *           - op4
 *       - name: writer
 *         description: "Writer of the notice"
 *         in: formData
 *         type: string
 *       - name: content
 *         description: "Content of the notice"
 *         in: formData
 *         type: string
 *       - name: fileUpload
 *         description: "File upload path"
 *         in: formData
 *         type: string
 *     responses:
 *         '200':
 *          description: "Add ok"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "Add ok"
 *         '400':
 *          description: "Add err"
 *          schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *             example: "Add err"
 */

