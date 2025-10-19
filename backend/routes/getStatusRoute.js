const express = require('express');
const router = express.Router();

const {getStatus} = require('../controllers/getStatusController');

router.post('/',getStatus);

module.exports = router;