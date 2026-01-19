


const express = require('express');


const router = express.Router();


const {showAssignees} = require('../../controllers/Employees/showAssignees');

router.get('/',showAssignees);


module.exports = router;