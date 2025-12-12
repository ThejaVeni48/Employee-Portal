

const express = require('express');

const router = express.Router();


const {getSchedulers} = require('../../../controllers/Projects/Schedulers/getSchedule');



router.get('/',getSchedulers);



module.exports = router;