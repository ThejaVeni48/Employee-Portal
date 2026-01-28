


const express = require('express');

const router = express.Router();


const {EditHierarchy} = require('../../controllers/Projects/editHierarchy');


router.put('/',EditHierarchy);


module.exports = router;