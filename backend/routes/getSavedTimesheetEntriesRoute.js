const express = require('express');
const router = express.Router();


const {getSavedTimeSheetEntries}  =require('../controllers/getSavedTimesheetEntriesController');

router.get('/',getSavedTimeSheetEntries);

module.exports = router;