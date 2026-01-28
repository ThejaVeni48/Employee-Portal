

const express = require('express');

const router = express.Router();


const {createBranchHolidays} = require('../../../controllers/Branch/Holidays/createHolidays');


router.post('/',createBranchHolidays);



module.exports = router;