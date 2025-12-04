
const express = require('express');

const router = express.Router();


const {hierarchyforAll} = require('../../controllers/Projects/HierarchyForAll');


router.post('/',hierarchyforAll);


module.exports = router;