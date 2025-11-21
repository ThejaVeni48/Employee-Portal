const express = require('express');

const router = express.Router();



const {getPMProjects} = require('../controllers/getProjectsPM');


router.get('/',getPMProjects);


module.exports = router;