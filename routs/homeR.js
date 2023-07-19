const express = require("express");
const homeCon = require("../controllers/home");
const router = express.Router();

router.route('/home').get(homeCon.getCakes);
router.route('/').get(homeCon.show);

router.route('/userHome').get(homeCon.getCakes);
router.route('/addToCart').post(homeCon.addToCart);

router.route('/cakes').get(homeCon.groupBy);

router.route('/ratings')
                        .get(homeCon.getRates)
                        .post(homeCon.Rate);
router.route('/orders').get(homeCon.getOrders);

router.route('/locations').get(homeCon.getLocations);

module.exports = router;