


const express = require('express');


const router = express.Router();


const {saveTimesheet} = require('../../controllers/Timesheets/saveTimesheet');


router.post('/',saveTimesheet);


module.exports = router;