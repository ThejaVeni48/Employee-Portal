const express = require('express');
const router = express.Router();


const {leaveTypes} = require('../../controllers/Leaves/leaveTypes');

router.get('/',leaveTypes);

module.exports = router;