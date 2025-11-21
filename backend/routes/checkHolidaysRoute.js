const express = require('express');
const router = express.Router();



const {checkHolidays} = require('../controllers/checkHolidaysController');

router.post('/',checkHolidays);


module.exports = router;