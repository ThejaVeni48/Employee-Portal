const express = require('express');

const router = express.Router();

const {addEmp} = require('../../controllers/Employees/addEmp');


router.post('/',addEmp);

module.exports = router;