

const express = require('express');
const router = express.Router();



const {getPendingTimesheets} = require('../../controllers/Timesheets/getPendingTimesheets');


router.get('/',getPendingTimesheets);


module.exports = router;