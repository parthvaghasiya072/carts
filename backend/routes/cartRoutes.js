const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');


router.post('/addtocart', addToCart);

router.get('/getcart/:cartId', getCart);

router.put('/updateitem/:cartId/:productId', updateCartItem);

router.delete('/removeitem/:cartId/:productId', removeFromCart);

router.delete('/clearcart/:cartId', clearCart);

module.exports = router;
