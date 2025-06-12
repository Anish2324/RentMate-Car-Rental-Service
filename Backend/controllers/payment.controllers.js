import Payment from "../models/Payment.js";
import Booking from "../models/bookingModel.js";
import axios from "axios";

// Helper to get access token from PayPal
const getAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  const response = await axios({
    url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    method: "post",
    auth: {
      username: clientId,
      password: secret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  });

  return response.data.access_token;
};

// Controller to capture the PayPal order and store payment
export const capturePayment = async (req, res) => {
  try {
    const { orderId, bookingId } = req.body;
    const userId = req.user._id; // Make sure you have auth middleware

    if (!orderId || !bookingId) {
      return res.status(400).json({ message: "orderId and bookingId are required" });
    }

    const accessToken = await getAccessToken();

    // Capture the payment from PayPal
    const captureResponse = await axios({
      method: "post",
      url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = captureResponse.data;

    const paymentId = captureData.purchase_units[0].payments.captures[0].id;
    const status = captureData.status;
    const amount = captureData.purchase_units[0].payments.captures[0].amount.value;
    const currency = captureData.purchase_units[0].payments.captures[0].amount.currency_code;

    // Save to MongoDB
    const newPayment = new Payment({
      orderId,
      paymentId,
      status,
      amount,
      currency,
      userId,
      bookingId,
    });

    await newPayment.save();

    res.status(201).json({ message: "Payment recorded", payment: newPayment });
  } catch (error) {
    console.error("Error in capturePayment:", error.response?.data || error.message);
    res.status(500).json({ message: "Payment processing failed", error: error.message });
  }
};
