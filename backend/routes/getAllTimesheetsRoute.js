

const express = require('express');
const router = express.Router();





const {getAllTimesheets} = require('../controllers/getAllTimesheetsController');

router.get('/',getAllTimesheets);


module.exports = router;