

const express = require('express');

const router = express.Router();


const {checkStatus} = require('../../controllers/Login/checkStatus');

router.put('/',checkStatus);


module.exports = router;