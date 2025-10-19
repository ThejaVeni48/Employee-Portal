const express = require('express');
const router = express.Router();

const {getSubmittedTimesheets} = require('../controllers/getSubmittedTimesheetsController');

router.get('/',getSubmittedTimesheets);

module.exports = router;