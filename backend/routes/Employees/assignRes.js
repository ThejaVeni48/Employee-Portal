
const express = require('express');
const router = express.Router();



const {assignRes} = require('../../controllers/Employees/assignRes');


router.post('/',assignRes);



module.exports = router;