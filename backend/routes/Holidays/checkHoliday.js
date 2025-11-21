

const express = require('express');

const router = express.Router();

const {checkHolidays} = require('../../controllers/Holidays/checkHoliday');


router.post('/',checkHolidays);


module.exports = router;