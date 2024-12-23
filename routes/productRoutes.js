import express from 'express';
import { addProduct, updateProduct,deleteProduct, getProduct, subscribeProduct } from '../controllers/productController.js';

const router = express.Router();

router.post('/add', addProduct);
router.get('/all', getProduct);
router.put('/edit', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.patch('/subscribe/:userId/:productId', subscribeProduct);

export default router;
