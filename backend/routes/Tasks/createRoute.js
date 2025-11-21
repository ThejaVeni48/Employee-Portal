


const express = require('express');

const router = express.Router();



const {createTask} = require('../../controllers/Tasks/createController');


router.post('/',createTask);


module.exports = router;