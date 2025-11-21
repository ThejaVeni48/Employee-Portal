

const express = require('express');


const router = express.Router();


const {getSavedTimeSheetEntries} = require('../../controllers/Timesheets/getSavedTimesheetsController');


router.get('/',getSavedTimeSheetEntries);


module.exports = router;