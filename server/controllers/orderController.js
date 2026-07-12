import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

const getShippingFee = (district) => {
  if (!district) return 120; // district na dile bairer dhore neya
  const normalized = district.trim().toLowerCase();
  return normalized === "dhaka" ? 60 : 120;
};

const buildManualPayment = (paymentMethod, body) => {
  if (paymentMethod !== "bkash" && paymentMethod !== "nagad") return undefined;
  const { senderNumber, transactionId } = body.manualPayment || {};
  if (!senderNumber || !transactionId) {
    const err = new Error(
      "Please provide the number you sent money from and the Transaction ID after paying"
    );
    err.statusCode = 400;
    throw err;
  }
  return {
    provider: paymentMethod,
    receiverNumber: "01568540290",
    senderNumber,
    transactionId,
  };
};

// @desc Place a new order from the user's cart (all items, or a selected subset)
// @route POST /api/orders
export const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, couponCode, selectedItems } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const itemsToOrder =
      Array.isArray(selectedItems) && selectedItems.length > 0
        ? cart.items.filter((item) => selectedItems.includes(item.product._id.toString()))
        : cart.items;

    if (itemsToOrder.length === 0) {
      return res.status(400).json({ success: false, message: "No items selected for checkout" });
    }

    let manualPayment;
    try {
      manualPayment = buildManualPayment(paymentMethod, req.body);
    } catch (err) {
      return res.status(err.statusCode || 400).json({ success: false, message: err.message });
    }

    let subtotal = 0;
    const orderItems = itemsToOrder.map((item) => {
      const price = item.product.price - (item.product.price * item.product.discount) / 100;
      subtotal += price * item.quantity;
      return {
        product: item.product._id,
        title: item.product.title,
        image: item.product.image,
        price,
        quantity: item.quantity,
      };
    });

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.expiryDate > new Date() && subtotal >= coupon.minOrderAmount) {
        discount = (subtotal * coupon.discountPercent) / 100;
      }
    }

    const shippingFee = getShippingFee(shippingAddress?.district);
    const total = subtotal - discount + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod,
      manualPayment,
      paymentStatus: "pending",
      couponCode: couponCode || null,
      source: "cart",
    });

    for (const item of itemsToOrder) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    const orderedIds = itemsToOrder.map((i) => i.product._id.toString());
    cart.items = cart.items.filter((item) => !orderedIds.includes(item.product._id.toString()));
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc Place a direct order for a single product ("Buy Now"), skipping the cart
// @route POST /api/orders/direct
export const placeDirectOrder = async (req, res, next) => {
  try {
    const { productId, quantity = 1, shippingAddress, paymentMethod, couponCode } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock available" });
    }

    let manualPayment;
    try {
      manualPayment = buildManualPayment(paymentMethod, req.body);
    } catch (err) {
      return res.status(err.statusCode || 400).json({ success: false, message: err.message });
    }

    const price = product.price - (product.price * product.discount) / 100;
    const subtotal = price * quantity;

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.expiryDate > new Date() && subtotal >= coupon.minOrderAmount) {
        discount = (subtotal * coupon.discountPercent) / 100;
      }
    }

    const shippingFee = getShippingFee(shippingAddress?.district);
    const total = subtotal - discount + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items: [
        {
          product: product._id,
          title: product.title,
          image: product.image,
          price,
          quantity,
        },
      ],
      shippingAddress,
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod,
      manualPayment,
      paymentStatus: "pending",
      couponCode: couponCode || null,
      source: "buy_now",
    });

    product.stock -= quantity;
    await product.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc Get logged in user's orders
// @route GET /api/orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc Get single order (owner or admin)
// @route GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc Cancel an order (owner, only if pending)
// @route PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    if (order.orderStatus !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending orders can be cancelled" });
    }
    order.orderStatus = "cancelled";
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc Get all orders (admin)
// @route GET /api/admin/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc Update order status (admin)
// @route PUT /api/admin/orders/:id
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
