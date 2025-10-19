const express = require('express');
const router = express.Router();


const {checkLeaves} = require('../controllers/checkLeavesController');

router.post('/',checkLeaves);


module.exports = router;