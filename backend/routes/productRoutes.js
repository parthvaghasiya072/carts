const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/getallproducts', getAllProducts);

router.post('/createproduct', upload.single('image'), createProduct);

router.get('/getproduct/:id', getProductById);

router.put('/updateproduct/:id', updateProduct);

router.delete('/deleteproduct/:id', deleteProduct);

module.exports = router;
