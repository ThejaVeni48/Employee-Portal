

const express = require('express');

const router = express.Router();

const {approvalHierarchy} = require('../../controllers/Projects/addApprovalHierarchy');


router.post('/',approvalHierarchy);


module.exports = router;