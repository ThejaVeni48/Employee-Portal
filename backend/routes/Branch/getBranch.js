


const express = require('express');


const router = express.Router();


const {getBranch} = require('../../controllers/Branch/getBranch');


router.get('/',getBranch);


module.exports = router;