const express = require('express');
const router = express.Router();



const {getTasks} = require('../controllers/getTasks');


router.get('/',getTasks);


module.exports = router;