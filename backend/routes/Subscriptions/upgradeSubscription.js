

const express = require('express');

const router = express.Router();


const {upgradeSubscription} = require('../../controllers/Subscription/upgradeSubscription');


router.post('/',upgradeSubscription);



module.exports = router;