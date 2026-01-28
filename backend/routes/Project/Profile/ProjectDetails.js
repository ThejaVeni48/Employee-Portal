


const express = require('express');

const router = express.Router();


const {ProjectDetails} = require('../../../controllers/Projects/Profile/ProjectDetails');

router.get('/',ProjectDetails);


module.exports = router;