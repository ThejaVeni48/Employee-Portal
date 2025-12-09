

const express = require('express');

const router = express.Router();

const {getHoliday} = require('../../controllers/Holidays/getHolidays');


router.get('/',getHoliday);


module.exports = router;

