const express = require('express');

const router = express.Router();

const {getEmployees} = require('../../controllers/Employees/getEmp');


router.get('/',getEmployees);

module.exports = router;