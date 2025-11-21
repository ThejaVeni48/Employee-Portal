

const express = require('express');

const router = express.Router();

const {empProjects} = require('../../controllers/EmpProjects/getController');


router.get('/',empProjects);


module.exports = router;