

const express = require('express');
const router = express.Router();



const {getSubmittedTimesheets} = require('../../controllers/Timesheets/getPendingTimesheets');


router.get('/',getSubmittedTimesheets);


module.exports = router;