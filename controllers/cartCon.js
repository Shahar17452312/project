const Cake = require('../model/cake');
const User = require('../model/user');
const Order = require('../model/order');
const mongoose = require('mongoose');
//return the user cart
exports.show = async (req,res)=>{
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate('cart.productId');
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.cart === null) {
      user.cart = [];
      await user.save();
    }
    const populatedCart = user.cart.map((item) => ({
      _id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      description: item.productId.description,
      quantity: item.quantity,
    }));

    res.json(populatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
//adds to the cart an item
exports.add = async (req,res)=>{
    try {
        var { productId, quan , userId} = req.body;
        var quantity = parseInt(quan);
        const product = await Cake.findById(productId);
        if (!product) {
          return res.status(404).send('Product not found');
        }
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).send('User not found');
        }
        var cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (cartItem) {
          var num =  parseInt(quantity);
          cartItem.quantity+=num;
          quantity = cartItem.quantity;

        } else {
          quantity = quan;
          cartItem= user.cart.push({
            productId,
            quantity
          });
        }
        await user.save();
        res.json(quantity);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
};
//removes item from cart
exports.remove =async (req,res)=>{
  try {
    const { productId, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const index = user.cart.findIndex((item) => item.productId.toString() === productId);
    if (index !== -1) {
      user.cart.splice(index, 1);
    }
    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
//update - quantity - user 
exports.update = async (req,res)=>{
        try {
          const { productId, quantity, userId } = req.body;
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).send('User not found');
          }
          const cartItem = user.cart.find(item => item.productId.toString() === productId);
          if (cartItem) {
            cartItem.quantity = quantity;
          }
          await user.save();
          res.json(user.cart);
        } catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        }
};
//reomves all items from the user cart
exports.clear = async (req,res)=>{
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).send('User not found');
        }
        user.cart = [];
        await user.save();
        res.json(user.cart);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
};
//take the user cart and makes a new order
exports.checkout = async (req,res)=>{
  const { userId, orderDate } = req.body;
  try {
    const user = await User.findById(userId).populate('cart.productId').exec();
    if (!user) {
      return res.status(404).send('User not found');
    }
    const products = user.cart.map((item) => {
      return {
        productName: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price
      };
    });
    let totalAmount = 0;
    for (let i = 0; i < user.cart.length; i++) {
      const cartItem = user.cart[i];
      const product = cartItem.productId;
      const quantity = cartItem.quantity;
      const price = product ? product.price : 0; 
      const subTotal = quantity * price;
      totalAmount += subTotal;
    }
    const newOrder = new Order({
      userId: userId,
      products: products,
      totalAmount: totalAmount,
      orderDate: orderDate
    });
    await newOrder.save();
    res.status(200).json(newOrder);
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).send('Error saving order');
  }
};
//returns orders for specific user id
exports.orders = async (req,res)=>{
  try {
    const userId = req.body.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid userId');
    }
    const userOrders = await Order.find({ userId });
    res.json(userOrders);
  } catch (error) {
    console.error('Error retrieving user orders:', error);
    res.status(500).send('Error retrieving user orders');
  }
};
//return all orders
exports.getAllOrders = async (req,res)=>{
  try{
    const orders = await Order.find({}).populate('userId');
    res.json(orders);
  }catch (error) {
    console.error('Error retrieving all orders:', error);
    res.status(500).send('Error retrieving all orders');
  }
}