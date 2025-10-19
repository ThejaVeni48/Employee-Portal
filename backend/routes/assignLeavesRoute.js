const express = require('express');
const router = express.Router();



const {assignLeaves} = require('../controllers/assignLeavesController');

router.post('/',assignLeaves);

module.exports = router;