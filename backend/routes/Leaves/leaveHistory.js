const express = require('express');
const router = express.Router();


const {leaveHistory} = require('../../controllers/Leaves/leaveHistory');

router.get('/',leaveHistory);

module.exports = router;