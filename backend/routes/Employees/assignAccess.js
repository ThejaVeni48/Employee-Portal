const express = require('express');

const router = express.Router();


const {assignAccess} = require('../../controllers/Employees/assignAccess');


router.post('/',assignAccess);



module.exports = router;