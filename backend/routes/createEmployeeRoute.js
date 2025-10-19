const express = require('express');
const router = express.Router();

const {createEmp} = require('../controllers/CreateEmployeecontroller');

router.post('/',createEmp);


module.exports = router;