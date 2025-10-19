const express = require('express');
const router = express.Router();


const {getLeaveTypes} = require('../controllers/getLeavesTypescontroller');


router.get('/',getLeaveTypes);

module.exports = router;