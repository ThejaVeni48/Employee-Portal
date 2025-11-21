

const express = require('express');
const router = express.Router();


const {activeProject} = require('../../controllers/Projects/activeProjectController');


router.get('/',activeProject);


module.exports = router;