

const express = require('express');

const router = express.Router();

const {inactiveRole} = require('../../controllers/Roles/inactiveRole');

router.put('/',inactiveRole);


module.exports = router;