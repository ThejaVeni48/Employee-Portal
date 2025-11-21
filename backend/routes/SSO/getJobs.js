const express = require('express');


const router = express.Router();



const {getDefaultJobs} = require('../../controllers/SSO/getJobs');





router.get('/',getDefaultJobs);


module.exports = router;