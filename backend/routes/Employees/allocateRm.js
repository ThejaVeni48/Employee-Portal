

const express = require('express');


const router = express.Router();


const {allocateRM} = require('../../controllers/Employees/allocateRm');


router.post('/',allocateRM);

module.exports = router;