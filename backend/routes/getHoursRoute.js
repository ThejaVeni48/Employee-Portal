const express = require('express');
const router = express.Router();

const {getHours} = require('../controllers/getHourscontroller');

router.get('/',getHours);


module.exports = router;