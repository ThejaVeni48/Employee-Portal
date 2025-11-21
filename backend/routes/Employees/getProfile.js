

const express = require('express');
const router = express.Router();



const {empProfile} = require('../../controllers/Employees/getProfile');



router.get('/',empProfile);


module.exports = router;