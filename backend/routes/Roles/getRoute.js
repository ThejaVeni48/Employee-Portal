
const express = require('express');


const router = express.Router();


const {getOrgRole} = require('../../controllers/Roles/getController');


router.get('/',getOrgRole)
module.exports = router;