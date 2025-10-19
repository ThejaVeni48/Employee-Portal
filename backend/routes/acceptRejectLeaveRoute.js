const express = require('express');

const {acceptRejectLeave} = require('../controllers/acceptRejectLeavecontroller');


const router = express.Router();


router.post('/',acceptRejectLeave);


module.exports = router;