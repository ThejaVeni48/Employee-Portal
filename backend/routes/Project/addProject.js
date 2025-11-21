const express = require('express');

const router = express.Router();



const {addProject} = require('../../controllers/Projects/addProject');


router.post('/',addProject);


module.exports = router;