// this api is used for making the employees inactive/exit or extend the contract.



const express = require('express');


const router = express.Router();


const {changeStatus} = require('../../controllers/Projects/changeStatus');


router.put('/',changeStatus);


module.exports = router;