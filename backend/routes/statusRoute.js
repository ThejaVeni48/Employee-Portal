const express = require('express');
const router = express.Router();



const {status} = require('../controllers/statusController');

router.post('/',status);


module.exports = router;