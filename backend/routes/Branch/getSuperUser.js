

const express = require('express');


const router = express.Router();


const {getSuperUsersByBranch}  = require('../../controllers/Branch/getSuperUser');



router.get('/',getSuperUsersByBranch);


module.exports = router;