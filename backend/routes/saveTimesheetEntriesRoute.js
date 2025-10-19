const express = require('express');
const router = express.Router();



const {saveTimeSheets} = require('../controllers/saveTimesheetEntriesController');

router.post('/',saveTimeSheets);

module.exports = router;