

const express = require('express');

const router = express.Router();


const {assignShift} = require('../../controllers/Shifts/assignShifts');


router.post('/',assignShift);

module.exports = router;