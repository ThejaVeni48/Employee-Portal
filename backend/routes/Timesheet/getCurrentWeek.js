

const express = require('express');

const router = express.Router();

const {currentWeek} = require('../../controllers/Timesheets/getCurrentWeek');



router.get('/',currentWeek);


module.exports = router;