

const express = require('express');

const router = express.Router();


const {getTask} = require('../../controllers/Tasks/getTask');


router.get('/',getTask);


module.exports = router;