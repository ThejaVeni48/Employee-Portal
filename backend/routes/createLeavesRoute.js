const express = require('express');
const router = express.Router();

const {leavesCreate} = require('../controllers/CreateLeavesController');

router.post('/',leavesCreate);

module.exports = router;