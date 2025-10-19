const express = require('express');
const router = express.Router();


const {getLeaves} = require('../controllers/getLeavescontroller');
const e = require('express');

router.get('/',getLeaves);

module.exports = router;