const express = require('express');
const router = express.Router();


const {postTimeSheet} = require('../controllers/PostTimesheetController');

router.post('/',postTimeSheet);

module.exports = router;