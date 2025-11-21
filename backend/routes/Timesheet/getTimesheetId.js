

const express = require('express');


const router = express.Router();



const {getTimesheetId} = require('../../controllers/Timesheets/getTimesheetId');


router.post('/',getTimesheetId);



module.exports = router;