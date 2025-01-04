import { io } from '../server.js';

import Product  from '../models/productModel.js'
import Subscription from '../models/subscriptionModel.js'

export const getAllProducts = async (req, res) => {
  try {
    const userId= req.user._id; // Assuming `userId` is available from the authenticated user (e.g., decoded JWT token)


    // Fetch all products
    const productData = await Product.find();

    const products = await Promise.all(productData.map(async (product) => {
      const subscription = await Subscription.findOne({ userId, productId: product._id });

      return {
        ...product.toObject(),
        isSubscribed: subscription ? subscription.subscribed : false, 
      };
    }));
    

    res.json({ success: true, products });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ success: false, message: err.message });
  }
};


export const addProduct = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({success:false, message: 'Not authorized' });
  
  const { name, price, description } = req.body;
  const imageUrl = req.file?.path; 

  const newProduct = new Product({ name, price, description, imageUrl });

  try {
    await newProduct.save();
    res.json({success:true,newProduct});
  } catch (err) {
    res.status(500).json({success:false,message:"Error occured while adding product"});
  }
};

export const updateProduct = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

  console.log();
  const { id } = req.params;
  const { name, price, description } = req.body;
  const imageUrl = req.file?.path; 


  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, description, imageUrl }, { new: true });
    if(!updateProduct){
      return res.status(404).json({ message: "Product not found" });
    }

    const subscriptions=await Subscription.find({productId:id})
    
    const userIds=subscriptions.map(((sub)=>sub.userId))


    userIds.forEach((userId)=>{
      
      io.to(userId.toString()).emit("productUpdated",{
        productId:id,
        changes:{name,price,description,imageUrl}
      })
    })
    res.json({success:true,updatedProduct});
  } catch (err) {
    res.status(500).json({success:false,message:"Error occured while updating product"});
  }
};

export const listProduct = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.listed = !product.listed;
    await product.save();
    res.json({success:true, message: 'Product listing updated' });

  } catch (err) {
    res.status(500).json({success:false,message:err});
  }
};
// export const deleteProduct = async (req, res) => {
//   if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

//   const { id } = req.params;

//   try {
//     await Product.findByIdAndDelete(id);
//     res.json({ message: 'Product deleted' });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// router.post('/subscribe/:productId', verifyToken, async (req, res) => {
export const subscribe= async (req, res) => {
    try {
      const userId = req.user.id; // Assuming JWT contains user info
      const productId = req.params.productId;
  
      // Check if the user is already subscribed
      const existingSubscription = await Subscription.findOne({ userId, productId });
  
      if (existingSubscription) {
        return res.status(400).json({ message: 'Already subscribed to this product.' });
      }
  
      const subscription = new Subscription({ userId, productId, subscribed: true });
      await subscription.save();
  
      // Optionally update the product with the subscription count
    //   await Product.findByIdAndUpdate(productId, { $inc: { subscriptionCount: 1 } });
  
      res.status(200).json({success:true, message: 'Subscribed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({success:false, message: 'Server error' });
    }
  }
  
  // Unsubscribe from a product
//   router.post('/unsubscribe/:productId', verifyToken, async (req, res) => {
    export const unsubscribe= async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = req.params.productId;
  
      // Check if the user is subscribed
      const existingSubscription = await Subscription.findOne({ userId, productId });
  
      if (!existingSubscription) {
        return res.status(400).json({ message: 'Not subscribed to this product.' });
      }
  
      await Subscription.findOneAndDelete({ userId, productId });
  
      // Optionally update the product with the subscription count
    //   await Product.findByIdAndUpdate(productId, { $inc: { subscriptionCount: -1 } });
  
      res.status(200).json({success:true, message: 'Unsubscribed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({success:false, message: 'Server error' });
    }
  }
  
