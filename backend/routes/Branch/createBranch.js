


const express = require('express');


const router = express.Router();


const {createBranch} = require('../../controllers/Branch/createBranch');


router.post('/',createBranch);



module.exports = router;