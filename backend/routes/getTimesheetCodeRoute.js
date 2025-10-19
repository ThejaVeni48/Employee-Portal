const express = require('express');
const router = express.Router();


const {getTimeSheetCode} = require('../controllers/getTimesheetCodeController');

router.get('/',getTimeSheetCode);

module.exports = router;