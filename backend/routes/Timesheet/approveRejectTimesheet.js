

const express = require('express');
const router = express.Router();



const {acceptTimesheet} = require('../../controllers/Timesheets/approveRejectTimesheet');


router.post('/',acceptTimesheet);


module.exports = router;