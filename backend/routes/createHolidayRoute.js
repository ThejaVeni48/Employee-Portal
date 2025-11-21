
const express = require('express');
const router = express.Router();

const {CreateHoliday} = require('../controllers/createHoliday');


router.post('/',CreateHoliday);


module.exports = router;