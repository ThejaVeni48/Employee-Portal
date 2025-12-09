

const express = require('express');

const router = express.Router();

const {createHolidays} = require('../../controllers/Holidays/createController');


router.post('/',createHolidays);


module.exports = router;

