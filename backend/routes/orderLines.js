


const express = require('express');

const router = express.Router();



const {orderLines} = require('../controllers/orderLines');


router.get('/',orderLines);


module.exports = router;