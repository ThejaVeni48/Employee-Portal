const express = require('express');
const router = express.Router();


const {getNotifications} = require('../controllers/getNotificationsController');

router.get('/',getNotifications);

module.exports = router;