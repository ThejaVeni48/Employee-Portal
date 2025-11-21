
const express = require('express');
const router = express.Router();



const {updatePStatus} = require('../../controllers/Projects/updateStatusController');


router.put('/',updatePStatus);

module.exports = router;