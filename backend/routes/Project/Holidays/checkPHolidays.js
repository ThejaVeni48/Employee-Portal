


const express =require('express');
const router = express.Router();



const {checkPHolidays} = require('../../../controllers/Projects/Holidays/checkHolidays');


router.get('/',checkPHolidays);



module.exports = router;