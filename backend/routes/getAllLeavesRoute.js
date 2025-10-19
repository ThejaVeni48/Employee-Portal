const express = require('express');
const router = express.Router();


const {getAllLeaves} = require('../controllers/getAllLeavescontroller');


router.get('/',getAllLeaves);

module.exports = router;