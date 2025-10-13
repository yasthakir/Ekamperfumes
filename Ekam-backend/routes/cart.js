const router = require('express').Router();
const Cart = require('../models/cart');
const { verifyToken } = require('../middleware/auth');

// Get user cart
router.get('/:userId', verifyToken, async (req,res)=>{
  const cart = await Cart.findOne({userId:req.params.userId});
  res.json(cart);
});

// Add product to cart
router.post('/:userId', verifyToken, async (req,res)=>{
  let cart = await Cart.findOne({userId:req.params.userId});
  if(cart){
    cart.products.push(req.body);
    cart = await cart.save();
  } else {
    cart = new Cart({userId:req.params.userId, products:[req.body]});
    await cart.save();
  }
  res.json(cart);
});

// Update cart
router.put('/:userId', verifyToken, async (req,res)=>{
  const cart = await Cart.findOneAndUpdate({userId:req.params.userId}, {$set:req.body}, {new:true});
  res.json(cart);
});

// Delete product from cart
router.delete('/:userId/:productId', verifyToken, async (req,res)=>{
  const cart = await Cart.findOne({userId:req.params.userId});
  cart.products = cart.products.filter(p => p.productId !== req.params.productId);
  await cart.save();
  res.json(cart);
});

module.exports = router;
