const express = require('express');
const router = express.Router();
const cartCon = require('../controllers/cartCon');

router.post('/cart',cartCon.show);
router.post('/cart/add',  cartCon.add);
router.post('/cart/remove' , cartCon.remove);
router.post('/cart/update', cartCon.update);
router.post('/cart/clear', cartCon.clear); 
router.post('/updateOrders' , cartCon.checkout);
router.post('/getUserOrders', cartCon.orders);
router.route('/getAdminOrders').post(cartCon.getAllOrders)

module.exports = router;
  