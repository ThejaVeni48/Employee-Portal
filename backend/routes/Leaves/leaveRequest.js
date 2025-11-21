const express = require('express');
const router = express.Router();


const {getPendingLeaves} = require('../../controllers/Leaves/leaveRequest');

router.get('/',getPendingLeaves);

module.exports = router;