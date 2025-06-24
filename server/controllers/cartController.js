const Cart = require('../models/Cart');


const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    return res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error("Add to Cart Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to add item to cart", error: error.message });
  }
};


const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    return res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error("Get Cart Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to get cart", error: error.message });
  }
};


const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(item => item.product.toString() === productId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
      return res.status(200).json({ success: true, message: "Quantity updated", cart });
    }

    return res.status(404).json({ success: false, message: "Product not found in cart" });

  } catch (error) {
    console.error("Update Cart Item Error:", error.message);
    return res.status(500).json({ success: false, message: "Error updating cart item", error: error.message });
  }
};


const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    return res.status(200).json({ success: true, message: "Item removed", cart });

  } catch (error) {
    console.error("Remove Cart Item Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to remove item", error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
};
