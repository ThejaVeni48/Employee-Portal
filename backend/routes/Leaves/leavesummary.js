const express = require('express');
const router = express.Router();


const {leavesummary} = require('../../controllers/Leaves/leavesummary');

router.get('/',leavesummary);

module.exports = router;