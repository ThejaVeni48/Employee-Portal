

const express = require('express');
const router = express.Router();



const {weeklyTimesheetCSV} = require('../../controllers/Timesheets/weeklyTimesheetCSV');


router.get('/',weeklyTimesheetCSV);


module.exports = router;