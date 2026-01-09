

const express = require('express');


const router = express.Router();


const {updateShift} = require('../../controllers/Shifts/updateShifts');


router.post('/',updateShift);


module.exports = router;