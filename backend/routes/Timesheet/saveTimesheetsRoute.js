

const express = require('express');


const router = express.Router();



const {saveTimeSheets} = require('../../controllers/Timesheets/saveTimesheetController');


router.post('/',saveTimeSheets);



module.exports = router;