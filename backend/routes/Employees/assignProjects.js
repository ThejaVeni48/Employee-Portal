
const express = require('express');
const router = express.Router();


const {assignProject} = require('../../controllers/Employees/assignProjects');


router.post('/',assignProject);


module.exports = router;