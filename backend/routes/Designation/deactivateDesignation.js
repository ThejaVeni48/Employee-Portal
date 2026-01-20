const express = require('express');
const router = express.Router();




const {inactiveDesignation} = require('../../controllers/Designations/deactiveDesignation');

router.put('/',inactiveDesignation);



module.exports = router;