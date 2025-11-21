const express = require('express');
const router = express.Router();




const {createOrgAccess} = require('../../controllers/Accessmodule/createController');

router.post('/',createOrgAccess);



module.exports = router;