const express = require('express');
const router = express.Router();


const {loginApi} = require('../../controllers/Login/loginController');

router.post('/',loginApi);

module.exports = router;