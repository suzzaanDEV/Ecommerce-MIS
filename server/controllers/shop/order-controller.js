const axios = require("axios");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const KHALTI_SECRET_KEY = '1d4555b002cf4589a3ae12d3a5630f64';
const KHALTI_API_URL = 'https://a.khalti.com/api/v2/epayment/initiate/';
const KHALTI_LOOKUP_URL = 'https://a.khalti.com/api/v2/epayment/lookup/';

// Create Order for Khalti Payment
// const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       addressInfo,
//       orderStatus,
//       paymentMethod,
//       paymentStatus,
//       totalAmount,
//       orderDate,
//       orderUpdateDate,
//       cartId,
//     } = req.body;
//
//
//     const create_payment_json = {
//       return_url: "http://localhost:5173/shop/khalti-return",
//       website_url: "http://localhost:5173",
//       amount: Number(totalAmount) * 100,
//       purchase_order_id: `order-${Date.now()}`,
//       purchase_order_name: `Order for ${userId}`,
//     };
//
//     console.log(create_payment_json);
//
//     const response = await axios.post(KHALTI_API_URL, create_payment_json, {
//       headers: {
//         Authorization: `Key ${KHALTI_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//     });
//
//     console.log("Payment response:", response.data);
//
//     const { pidx, payment_url } = response.data;
//
//     const newlyCreatedOrder = new Order({
//       userId,
//       cartId,
//       cartItems,
//       addressInfo,
//       orderStatus,
//       paymentMethod,
//       paymentStatus,
//       totalAmount,
//       orderDate,
//       orderUpdateDate,
//     });
//
//     await newlyCreatedOrder.save();
//
//     res.status(201).json({
//       success: true,
//       payment_url,
//       orderId: newlyCreatedOrder._id,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error while creating Khalti payment",
//     });
//   }
// };
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    // Validate totalAmount
    if (totalAmount < 10 || totalAmount > 1000) {
      return res.status(400).json({
        success: false,
        message: "Total amount must be between Rs 10.0 and Rs 1000.0",
      });
    }

    const create_payment_json = {
      return_url: "http://localhost:5173/shop/khalti-return",
      website_url: "http://localhost:5173",
      amount: Number(totalAmount) * 100, // Convert to paisa
      purchase_order_id: `order-${Date.now()}`,
      purchase_order_name: `Order for ${userId}`,
    };

    console.log("Requesting Khalti payment:", create_payment_json);

    // Khalti API call
    const response = await axios.post(KHALTI_API_URL, create_payment_json, {
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Khalti payment response:", response.data);

    const { pidx, payment_url } = response.data;

    // Save the order in the database
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentDetails: { pidx }, // Optionally store payment info
    });

    await newlyCreatedOrder.save();

    // Respond with success
    res.status(201).json({
      success: true,
      payment_url,
      orderId: newlyCreatedOrder._id,
    });
  } catch (error) {
    console.error("Error while creating order:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Error while creating Khalti payment",
    });
  }
};

// Capture Payment after successful Khalti payment
const capturePayment = async (req, res) => {
  try {
    const { pidx, orderId } = req.body;

    // Find order by ID
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Verify payment status via Khalti's API
    const verifyResponse = await axios.post(KHALTI_LOOKUP_URL, { pidx }, {
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const { status: paymentStatus } = verifyResponse.data;

    if (paymentStatus === "Completed") {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";

      // Update product stock
      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);
        if (!product || product.totalStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for product ${product.title}`,
          });
        }
        product.totalStock -= item.quantity;
        await product.save();
      }

      // Delete cart and save the confirmed order
      await Cart.findByIdAndDelete(order.cartId);
      await order.save();

      res.status(200).json({
        success: true,
        message: "Payment confirmed, order completed",
        data: order,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed or pending",
      });
    }
  } catch (error) {
    console.error("Khalti API error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Error occurred during payment verification",
    });
  }
};

// Get all orders by user
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching orders",
    });
  }
};

// Get order details
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching order details",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
