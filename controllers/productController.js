import Product from '../models/productModel.js';
import User from '../models/userModel.js';


export const getProduct = async (req, res) =>{
    try {
      const products = await Product.find(); // Fetch all products from the database
      res.status(200).json({ products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching products', error });
    }
  }
export const addProduct = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;
  

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
    });

    await newProduct.save();

    

    res.status(201).json({ success: true, message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};


export const updateProduct = async (req, res) => {
    const { id, formData } = req.body;
    console.log(req.body);
    
  
    try {
      const product = await Product.findById(id);
      console.log(product,"=============");
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const updatedFields = [];
      for (const key in formData) {
        if (formData[key] !== product[key]) {
          updatedFields.push({ field: key, newValue: formData[key] });
          product[key] = formData[key];
        }
      }
  
      product.updatedAt = Date.now();
      await product.save();
  
    
  
      res.status(200).json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error });
    }
  };
  export const deleteProduct = async (req, res) => {
    const { id } = req.params;

  
    try {
      const product = await Product.findById(id);
      
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
       await Product.findByIdAndDelete(id);
  
    
  
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error });
    }
  };
    


  export const subscribeProduct = async (req, res) => {
    const { userId, productId } = req.params; 
  
    try {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);
  
      if (!user || !product) {
        return res.status(404).json({ message: 'User or Product not found' });
      }
  
      if (!product.subscribers) {
        product.subscribers = [];
      }
  
      if (!user.subscribedTo) {
        user.subscribedTo = [];
      }
  
      if (!product.subscribers.includes(userId)) {
        product.subscribers.push(userId);
        await product.save();
      }
  
      if (!user.subscribedTo.includes(productId)) {
        user.subscribedTo.push(productId);
        await user.save();
      }
  
      return res.status(200).json({ message: 'Successfully subscribed to the product' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error subscribing to product' });
    }
  };
  
