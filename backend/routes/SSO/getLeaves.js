



const express = require('express');
const router = express.Router();



const {getSSOLeaves} = require('../../controllers/SSO/getLeaves');





router.get('/',getSSOLeaves);


module.exports = router;