

const express = require('express');
const router = express.Router();



const {getAllEmpTimesheets} = require('../../controllers/Timesheets/getAllTimesheets');


router.get('/',getAllEmpTimesheets);


module.exports = router;