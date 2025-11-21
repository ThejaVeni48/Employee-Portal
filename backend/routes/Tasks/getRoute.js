const express = require('express');
const router = express.Router();
const { getTasks } = require('../../controllers/Tasks/getController');

router.get('/', getTasks);

module.exports = router;
