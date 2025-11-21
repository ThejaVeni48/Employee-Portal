
const express = require('express');
const router = express.Router();



const {updateStatus} = require('../controllers/updateEmpStatusController.js');

router.put('/',updateStatus);


module.exports = router;