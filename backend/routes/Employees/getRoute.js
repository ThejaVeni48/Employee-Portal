const express = require('express');

const router = express.Router();

const {getEmployees} = require('../../controllers/Employees/getController');


router.get('/',getEmployees);

module.exports = router;