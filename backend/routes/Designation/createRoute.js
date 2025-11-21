const express = require('express');
const router = express.Router();




const {CreateDesignation} = require('../../controllers/Designations/create');

router.post('/',CreateDesignation);



module.exports = router;