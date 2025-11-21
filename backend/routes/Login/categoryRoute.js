const express = require('express');
const router = express.Router();


const {categoryLogin} = require('../../controllers/Login/categoryController');

router.post('/',categoryLogin);

module.exports = router;