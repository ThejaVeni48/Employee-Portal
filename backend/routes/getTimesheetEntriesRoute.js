const express = require('express');
const router = express.Router();


const {getTimesheetEntries} = require('../controllers/getTimesheetEntriesController');

router.get('/',getTimesheetEntries);

module.exports = router;