

const express  = require('express');

const router = express.Router();



const {createPHolidays} = require('../../../controllers/Projects/Holidays/post');


router.post('/',createPHolidays);


module.exports = router;