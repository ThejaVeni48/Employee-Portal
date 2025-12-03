


const express = require('express');


const router = express.Router();


const {createLeaves} = require('../../controllers/SSO/leaves');

router.post('/',createLeaves);


module.exports = router;