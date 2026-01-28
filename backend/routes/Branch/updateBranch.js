



const express = require('express');


const router = express.Router();



const {updateBranch} = require('../../controllers/Branch/updateBranch');


router.put('/',updateBranch);


module.exports = router;