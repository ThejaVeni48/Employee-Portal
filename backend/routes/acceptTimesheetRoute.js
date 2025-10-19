
const express = require('express');

const router = express.Router();


const {acceptTimesheet} = require('../controllers/acceptTimesheetcontroller');

router.post('/',acceptTimesheet);

module.exports = router;