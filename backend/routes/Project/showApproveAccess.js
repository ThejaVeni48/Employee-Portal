

const express = require('express');


const router = express.Router();


const {showApproveAccess} = require('../../controllers/Projects/showApproveaccess');

router.get('/',showApproveAccess);


module.exports = router;