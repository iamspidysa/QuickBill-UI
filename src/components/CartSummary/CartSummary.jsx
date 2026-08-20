import { useContext, useState } from "react";
import "./CartSummary.css";
import { AppContext } from "../../Context/AppContext";
import ReceiptPopup from "../ReceiptPopup/ReceiptPopup";
import { createOrder, deleteOrder } from "../../Service/OrderService";
import toast from "react-hot-toast";
import {
  createRazorpayOrder,
  verifyPayment,
} from "../../Service/PaymentService";
import { AppConstants } from "../../utils/constant";

const CartSummary = ({
  customerName,
  mobileNumber,
  setCustomerName,
  setMobileNumber,
}) => {
  const { cartItems, clearCart } = useContext(AppContext);

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Almost all electronic gadgets fall under 18% GST
  const tax = totalAmount * 0.18;

  const grandTotal = totalAmount + tax;

  // Called once an order is successfully placed AND paid for (cash is paid
  // instantly; UPI is paid once Razorpay verification succeeds). This is the
  // single point where we show the receipt and reset the form for the next
  // customer — there is no separate "place order" step, because placing the
  // order and completing the payment are the same action from the cashier's
  // point of view.
  const finalizeOrder = (details) => {
    setOrderDetails(details);
    setShowPopup(true);
    setCustomerName("");
    setMobileNumber("");
    clearCart();
  };

  const handlePrintReceipt = () => {
    window.print();
  };
  // Dynamically load Razorpay’s script into your webpage.
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const deleteOrderOnFailure = async (orderId) => {
    try {
      await deleteOrder(orderId);
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete order");
    }
  };

  const completePayment = async (paymentMode) => {
    if (!customerName || !mobileNumber) {
      toast.error("Please enter customer name and mobile number");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const orderData = {
      customerName,
      phoneNumber: mobileNumber,
      cartItems,
      // subTotal/tax/grandTotal are deliberately NOT sent — the backend
      // computes these from DB item prices to prevent client-side tampering.
      paymentMethod: paymentMode.toUpperCase(),
    };

    setIsProcessing(true);

    try {
      const response = await createOrder(orderData);
      const savedData = response.data;
      if (response.status === 201 && paymentMode === "cash") {
        toast.success("Order placed successfully");
        finalizeOrder(savedData);
      } else if (response.status === 201 && paymentMode === "upi") {
        //Load Razorpay sdk
        const razorpayLoaded = await loadRazorpayScript();
        if (!razorpayLoaded) {
          toast.error("Unable to load Razorpay");
          await deleteOrderOnFailure(savedData.orderId);
          return;
        }

        //If razorpay sdk loaded - create order
        const razorpayResponse = await createRazorpayOrder({
          orderId: savedData.orderId,
          currency: "INR",
        });
        const options = {
          key: AppConstants.RAZORPAY_KEY_ID,
          amount: razorpayResponse.data.amount,
          currency: razorpayResponse.data.currency,
          order_id: razorpayResponse.data.id,
          name: "Shri Hari Computers",
          description: "Order Payment",
          handler: async function (response) {
            await verifyPaymentHandler(response, savedData);
          },
          prefill: {
            name: customerName,
            contact: mobileNumber,
          },
          theme: {
            color: "3399cc",
          },
          modal: {
            ondismiss: async () => {
              await deleteOrderOnFailure(savedData.orderId);
              toast.error("Payment cancelled");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", async (response) => {
          await deleteOrderOnFailure(savedData.orderId);
          toast.error("Payment failed");
          console.log(response.error.description);
        });

        rzp.open();
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPaymentHandler = async (response, savedOrder) => {
    const paymentData = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      orderId: savedOrder.orderId,
    };

    try {
      const paymentResponse = await verifyPayment(paymentData);
      if (paymentResponse.status === 200) {
        toast.success("Payment successful");
        finalizeOrder({
          ...savedOrder,
          paymentDetails: {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          },
        });
      } else {
        toast.error("Payment processing failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    }
  };


  return (
    <div className="mt-2">
      <div className="cart-summary-details">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-light">Item :</span>
          <span className="text-light">&#x20B9; {totalAmount.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-light">GST (18%) : </span>
          <span className="text-light">&#x20B9; {tax.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-4">
          <span className="text-light">Total : </span>
          <span className="text-light">&#x20B9; {grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="d-flex gap-3">
        <button className="btn btn-success flex-grow-1" onClick={ () => completePayment("cash")} disabled={isProcessing}>{isProcessing ? "Processing..." : "Cash"}</button>
        <button className="btn btn-primary flex-grow-1" onClick={ () => completePayment("upi")} disabled={isProcessing}>{isProcessing ? "Processing..." : "UPI"}</button>
      </div>

      {
        showPopup && (
          <ReceiptPopup 
          orderDetails={{
            ...orderDetails,
            razorpayOrderId: orderDetails.paymentDetails?.razorpayOrderId,
            razorpayPaymentId: orderDetails.paymentDetails?.razorpayPaymentId,
          }}
          onClose={() => setShowPopup(false)}
          onPrint={handlePrintReceipt}
          />
        )
      }

    </div>
  );
};

export default CartSummary;
