const express = require('express');
const router = express.Router();


const {getAbsenteesCount} = require('../controllers/getAbsenteesCount');

router.get('/',getAbsenteesCount);


module.exports = router;