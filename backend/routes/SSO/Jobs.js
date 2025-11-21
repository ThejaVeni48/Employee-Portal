const express = require('express');


const router = express.Router();



const {createDefaultJobs} = require('../../controllers/SSO/Jobs');





router.post('/',createDefaultJobs);


module.exports = router;