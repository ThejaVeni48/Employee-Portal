

const express = require('express');
const router = express.Router();


const {saveSchedule} = require('../../../controllers/Projects/Schedulers/schedule');


router.post('/',saveSchedule);


module.exports = router;