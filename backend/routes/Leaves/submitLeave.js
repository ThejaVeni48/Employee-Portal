const express = require('express');
const router = express.Router();


const {submitLeave} = require('../../controllers/Leaves/submitLeave');

router.post('/',submitLeave);

module.exports = router;