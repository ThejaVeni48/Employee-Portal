


const express = require('express');
const router = express.Router();



const {getScheduleHours} = require('../../../controllers/Projects/Schedulers/getScheduledHours');



router.get('/',getScheduleHours);



module.exports = router;