const express = require('express');
const router = express.Router();




const {getDesignation} = require('../../controllers/Designations/get');

router.get('/',getDesignation);



module.exports = router;