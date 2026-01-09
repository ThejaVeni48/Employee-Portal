
const express = require('express');


const router = express.Router();


const {createShifts} = require('../../controllers/Shifts/createShifts');



router.post('/',createShifts);


module.exports = router;


