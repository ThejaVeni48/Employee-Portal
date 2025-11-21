const express = require('express');
const router = express.Router();


const {getProjectId} = require('../controllers/getProjectId');

router.get('/',getProjectId);


module.exports = router;