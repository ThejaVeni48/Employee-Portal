const express = require('express');
const router = express.Router();


const {submitLeave} = require('../controllers/submitLeaveController');



router.post('/',submitLeave);

module.exports =router;