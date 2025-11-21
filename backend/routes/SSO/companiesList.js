const express = require('express');


const router = express.Router();



const {CompaniesList} = require('../../controllers/SSO/companieslist');





router.get('/',CompaniesList);


module.exports = router;