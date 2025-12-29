



const express = require('express');

const router = express.Router();


const {updateDetails} = require('../../controllers/Employees/updateDetails');



router.put('/',updateDetails);



module.exports = router;