
const express = require('express');

const router = express.Router();


const {EmpTask} = require('../../controllers/Tasks/getEmpTasks');

router.get('/',EmpTask);


module.exports = router;