



const express = require('express');

const router = express.Router();


const {updateSuperUserStatus}  = require('../../controllers/Branch/deactiveSuperUser');


router.put('/',updateSuperUserStatus);



module.exports = router;