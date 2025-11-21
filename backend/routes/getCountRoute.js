const express = require('express');
const router = express.Router();



const {getCount} = require('../controllers/getCount');

router.get('/',getCount);


module.exports = router;