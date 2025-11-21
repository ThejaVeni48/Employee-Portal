const express = require('express');


const router = express.Router();



const {getDefaultDesgn} = require('../../controllers/SSO/geDesgn');





router.get('/',getDefaultDesgn);


module.exports = router;