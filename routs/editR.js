const express = require('express');
const router = express.Router();
const cont = require('../controllers/editCon');

router.route('/add').post(cont.add);
router.route('/cakes/:_id/edit').post(cont.update);
router.route('/cakes/:_id/remove').post(cont.remove);

module.exports = router;