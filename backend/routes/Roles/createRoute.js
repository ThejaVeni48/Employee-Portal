

const express = require('express');


const router = express.Router();



const {createOrgRole}  = require('../../controllers/Roles/CreateController');




router.post('/',createOrgRole);



module.exports = router;