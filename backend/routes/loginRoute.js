const express = require('express');
const router = express.Router();

const {loginApi} = require('../controllers/loginController');

router.post('/', loginApi);

module.exports = router;