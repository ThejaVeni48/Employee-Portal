const express = require('express');
const router = express.Router();

const {getEmp} = require('../controllers/getEmployeescontroller');

router.get('/',getEmp);


module.exports = router;