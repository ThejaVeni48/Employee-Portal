


const express = require('express');

const router = express.Router();


const {getProjectApprovers} = require('../../controllers/Projects/getProjectApprovers');


router.get('/',getProjectApprovers);


module.exports = router;