

const express = require('express');

const router = express.Router();


const {getProjectEmployee} = require('../../controllers/Projects/getEmpController');


router.get('/',getProjectEmployee);


module.exports = router;