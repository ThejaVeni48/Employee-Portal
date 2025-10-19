const express = require('express');
const router = express.Router();



const {assignedEmpP}  = require('../controllers/assignedEmpP');


router.get('/',assignedEmpP);


module.exports = router;