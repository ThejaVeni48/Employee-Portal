const express = require('express');
const router = express.Router();

const {addDept} = require('../controllers/addDeptController');

router.post('/',addDept);

module.exports = router;