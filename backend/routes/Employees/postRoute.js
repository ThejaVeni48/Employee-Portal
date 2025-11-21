const express = require('express');

const router = express.Router();

const {createEmployee} = require('../../controllers/Employees/createEmp');


router.post('/',createEmployee);

module.exports = router;