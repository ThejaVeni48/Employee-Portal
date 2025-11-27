


const express = require('express');


const router = express.Router();



const {getApproveHierarchy} = require('../../controllers/Projects/getApproveHierarchy');



router.get('/',getApproveHierarchy);


module.exports = router;