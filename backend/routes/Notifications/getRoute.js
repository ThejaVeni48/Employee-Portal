const express = require('express');
const router = express.Router();


const {getNotifications} = require('../../controllers/Notifications/getController');

router.get('/',getNotifications);

module.exports = router;