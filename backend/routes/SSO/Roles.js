const express = require('express');


const router = express.Router();



const {createDefaultRoles} = require('../../controllers/SSO/Roles');





router.post('/',createDefaultRoles);


module.exports = router;