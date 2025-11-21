

const express = require('express');

const router = express.Router();

const {CreateHoliday} = require('../../controllers/Holidays/createController');


router.post('/',CreateHoliday);


module.exports = router;

