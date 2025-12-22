



const express = require('express');
const router = express.Router();



const {TimesheetCustomization} = require('../../controllers/Settings/timesheetcustomization');


router.post('/',TimesheetCustomization)


module.exports = router;