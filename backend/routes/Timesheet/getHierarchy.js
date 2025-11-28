

const express = require('express');


const router = express.Router();


const {getHierarchy} = require('../../controllers/Timesheets/getHierarchy');

router.get('/',getHierarchy);



module.exports = router;