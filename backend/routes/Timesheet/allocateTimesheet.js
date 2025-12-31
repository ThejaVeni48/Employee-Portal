


const express = require('express');


const router = express.Router();


const {allocateTimesheets} = require('../../controllers/Timesheets/allocateTimesheets');


router.post('/',allocateTimesheets);


module.exports = router;