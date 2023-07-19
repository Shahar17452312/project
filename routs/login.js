const express = require('express');
const logCon = require('../controllers/logCon');
const router = express.Router();

router.route('/login')
                    .get(logCon.checkPass)
                    .post(logCon.checkPass);
router.route('/admin')
                    .get(logCon.show);
router.route('/logout')
                    .get(logCon.logout);                    

module.exports = router;

