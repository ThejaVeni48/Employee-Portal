


const express = require('express');


const router = express.Router();


const {LoginLookup} = require('../../controllers/Login/loginLookup');



router.get('/',LoginLookup);




module.exports = router;