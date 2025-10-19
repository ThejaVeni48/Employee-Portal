const express = require('express');
const router = express.Router();


const {showEmployeesL} = require('../controllers/showEmployeesLController');


router.get('/',showEmployeesL);


module.exports = router;