
const express = require('express');
const router = express.Router();



const {getAdminLeaves} = require('../controllers/getAdminLeaves');

router.get('/',getAdminLeaves);

module.exports = router;