
const express = require('express');
const router = express.Router();


const {assignProject} = require('../controllers/assignProjectController');

router.post('/',assignProject);


module.exports = router;