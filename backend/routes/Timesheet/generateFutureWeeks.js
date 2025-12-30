


const express = require('express');


const router = express.Router();


const {generateFutureWeeks} = require('../../controllers/Timesheets/generateFutureWeeks');


router.post('/',generateFutureWeeks);



module.exports  = router;