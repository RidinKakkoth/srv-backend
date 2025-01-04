import express from 'express'
import { getAllProducts, addProduct, updateProduct,listProduct, subscribe, unsubscribe } from '../controllers/productController.js'
import { authenticate } from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';

const router = express.Router();



router.get('/',authenticate, getAllProducts);
router.post('/', authenticate,upload.single("image"), addProduct);
router.put('/:id', authenticate,upload.single("image"), updateProduct);
router.patch('/:id', authenticate, listProduct);
// router.delete('/:id', authenticate, deleteProduct);
router.patch('/subscribe/:productId', authenticate, subscribe);
router.patch('/unsubscribe/:productId', authenticate, unsubscribe); 

export default router;
