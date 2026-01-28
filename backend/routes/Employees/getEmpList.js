


const express = require('express');


const router = express.Router();



const {getEmpList}  = require('../../controllers/Employees/getEmpList');


router.get('/',getEmpList);


module.exports = router;