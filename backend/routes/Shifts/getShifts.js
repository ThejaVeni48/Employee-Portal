

const express = require('express');

const router = express.Router();


const {getShifts} = require('../../controllers/Shifts/getShifts');

router.get('/',getShifts);


module.exports = router;