const express = require('express');


const router = express.Router();



const {createDefaultDesgn} = require('../../controllers/SSO/Designations');





router.post('/',createDefaultDesgn);


module.exports = router;