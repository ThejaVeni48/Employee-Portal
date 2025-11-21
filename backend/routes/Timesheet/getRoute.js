

const express = require('express');
const router = express.Router();



const {getTProjects} = require('../../controllers/Timesheets/getController');


router.get('/',getTProjects);


module.exports = router;