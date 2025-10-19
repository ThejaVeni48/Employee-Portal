const express = require('express');
const router = express.Router();


const {profileImage} = require('../controllers/getProfilePIcController');

router.get('/',profileImage);


module.exports = router;