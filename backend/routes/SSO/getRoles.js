const express = require('express');


const router = express.Router();



const {getDefaultRoles} = require('../../controllers/SSO/getRoles');





router.get('/',getDefaultRoles);


module.exports = router;