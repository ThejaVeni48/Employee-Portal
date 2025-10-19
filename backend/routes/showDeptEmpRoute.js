const express = require('express');
const router = express.Router();



const {showDeptEmp} = require('../controllers/showDeptEmp');

router.get('/',showDeptEmp);


module.exports = router;