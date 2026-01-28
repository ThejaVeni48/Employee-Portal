


const express = require('express');


const router = express.Router();


const {addSuperUser} = require('../../controllers/Branch/addSuperUser');


router.post('/',addSuperUser);


module.exports  = router;