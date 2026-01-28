



const express = require('express');

const router = express.Router();


const {getAllEmployees} = require('../../controllers/Employees/getAllEmployees');


router.get('/',getAllEmployees);


module.exports = router;