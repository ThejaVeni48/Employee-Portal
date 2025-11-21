const express = require('express');

const router = express.Router();



const {createRoles} = require('../controllers/createRolesController');

router.post('/',createRoles);




module.exports = router;