const express = require('express');
const router = express.Router();


const {getUserDetails} = require('../controllers/getUserDetailsController');


router.get('/',getUserDetails);

module.exports = router;
