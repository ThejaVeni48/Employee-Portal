

const express = require('express');


const router = express.Router();


const {getBranchHolidays} =require('../../../controllers/Branch/Holidays/getHolidays');


router.get('/',getBranchHolidays);


module.exports =router;