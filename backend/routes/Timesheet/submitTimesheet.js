

const express = require('express');
const router = express.Router();



const {submitTimeSheet} = require('../../controllers/Timesheets/submitTimesheets');


router.post('/',submitTimeSheet);


module.exports = router;