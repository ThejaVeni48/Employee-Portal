const express = require('express');
const router = express.Router();


const {createProject} = require('../controllers/createProjectController');


router.post('/',createProject);

module.exports = router;