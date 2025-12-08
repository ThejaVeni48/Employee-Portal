

const express  = require('express');

const router = express.Router();



const {getPHoliday} = require('../../../controllers/Projects/Holidays/get');


router.get('/',getPHoliday);


module.exports = router;