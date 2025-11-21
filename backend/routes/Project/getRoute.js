const express = require('express');

const router = express.Router();



const {getProject} = require('../../controllers/Projects/getProject');


router.get('/',getProject);



module.exports = router;