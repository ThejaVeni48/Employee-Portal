

const express = require('express');

const router = express.Router();


const {empProjects} = require('../../controllers/Employees/getEmpProjects');


router.get('/',empProjects);


module.exports = router;