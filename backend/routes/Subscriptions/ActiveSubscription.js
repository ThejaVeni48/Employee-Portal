

const express = require('express');

const router = express.Router();


const {activeSubscription} = require('../../controllers/Subscription/activeSubscription');


router.get('/',activeSubscription);


module.exports = router;