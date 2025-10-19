const express = require('express');
const router = express.Router();


const {showDept} = require('../controllers/showDeptsController');

router.get('/',showDept);

module.exports= router;