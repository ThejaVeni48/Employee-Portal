const express = require('express');
const router = express.Router();

const {companyRegister} = require('../controllers/companyRegistercontroller');

router.post('/',companyRegister);

module.exports = router;