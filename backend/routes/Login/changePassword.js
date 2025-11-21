const express = require('express');
const router = express.Router();


const {changePassword} = require('../../controllers/Login/changePassword');

router.put('/',changePassword);

module.exports = router;