const express = require('express');
const router = express.Router();

const {getApprovedTimesheet} = require('../controllers/getApprovedTimesheetscontroller');

router.get('/',getApprovedTimesheet);

module.exports = router;