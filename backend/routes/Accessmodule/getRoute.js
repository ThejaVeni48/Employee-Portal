const express = require('express');
const router = express.Router();




const {getOrgAccess} = require('../../controllers/Accessmodule/getController');

router.get('/',getOrgAccess);



module.exports = router;