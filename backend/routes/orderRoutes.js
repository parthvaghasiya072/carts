const express = require('express');
const router = express.Router();
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/orderController');

router.post('/createorder', createOrder);

router.get('/getallorders', getAllOrders);

router.get('/getorder/:id', getOrderById);


router.put('/updateorder/:id', updateOrderStatus);

router.delete('/deleteorder/:id', deleteOrder);

module.exports = router;
