const express = require('express');


const router = express.Router();



const {ApproveRejectOrg} = require('../../controllers/SSO/ApproveRejectOrg');





router.put('/',ApproveRejectOrg);


module.exports = router;