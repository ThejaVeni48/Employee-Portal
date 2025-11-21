const express = require('express');
const router = express.Router();


const {acceptRejectLeave} = require('../../controllers/Leaves/aceptRejectLeave');

router.post('/',acceptRejectLeave);

module.exports = router;