

const express = require('express');


const router = express.Router();


const {GetPlans} = require('../../controllers/Subscription/GetPlans');

router.get('/',GetPlans);


module.exports = router;