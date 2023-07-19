const express = require('express');
const regCon = require('../controllers/registerCon');
const router = express.Router();


router.post('/register' , regCon.saveInfo);

module.exports = router;
