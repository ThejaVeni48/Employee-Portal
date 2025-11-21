const express = require('express');
const router = express.Router();


const {addTask} = require('../controllers/addTaskController');

router.post('/',addTask);


module.exports = router;