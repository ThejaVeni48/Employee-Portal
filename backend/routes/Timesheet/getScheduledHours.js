

const express = require('express');


const router = express.Router();


const {getScheduledHours} = require('../../controllers/Timesheets/getScheduledHours');



router.get('/',getScheduledHours);


module.exports = router;