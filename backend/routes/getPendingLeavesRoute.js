const express = require('express');
const router = express.Router();

const {getPendingLeaves} = require('../controllers/getPendingLeavesController');


router.get('/',getPendingLeaves);


module.exports = router;