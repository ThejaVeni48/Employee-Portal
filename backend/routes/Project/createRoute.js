const express = require('express');
const router = express.Router();


const {createProject1} = require('../../controllers/Projects/createController');



router.post('/',createProject1);




module.exports = router;