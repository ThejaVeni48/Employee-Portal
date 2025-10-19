const express = require('express');
const router = express.Router();


const {showProjects}  = require('../controllers/showProjectsController');

router.get('/',showProjects);


module.exports = router;
