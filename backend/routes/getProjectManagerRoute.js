const express = require('express');

const router = express.Router();


const {getPM} = require('../controllers/getProjectManagersController');


router.get('/',getPM);

module.exports = router