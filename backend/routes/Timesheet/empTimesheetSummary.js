
const express = require('express');

const router = express.Router();


const {empTimesheetSummary} = require('../../controllers/Timesheets/empTimesheetSummary');


router.get('/',empTimesheetSummary);


module.exports = router;