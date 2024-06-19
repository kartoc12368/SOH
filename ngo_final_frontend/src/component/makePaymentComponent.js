"use client";
import { showSwal } from "@/validation";
import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";

const RazorpayPaymentComponent = ({ amount, name, reference, id }) => {
  useEffect(() => {
    const loadRazorpayScript = async () => {
      try {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
      } catch (error) {}
    };

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_serverAPI}/payment/checkout/${reference.reference}`,
          { amount }
        );
        return response?.data?.data?.id;
      } catch (error) {
        showSwal("error", "Something went wrong", "please try again");

        console.error("Error fetching order details:", error);
        throw new Error("Error fetching order details");
      }
    };

    const initiatePayment = async () => {
      try {
        await loadRazorpayScript();
        const orderDetails = await fetchOrderDetails();

        var options = {
          key: "rzp_test_b3XerWcrISxnCT", // Enter the Key ID generated from the Dashboard
          amount: parseInt(amount * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Support Our Heroes",
          description: "Test Transaction",
          image: "",
          order_id: orderDetails, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          callback_url: `${process.env.NEXT_PUBLIC_serverAPI}/payment/paymentVerfications?id=${id}`,
          // prefill: {
          //   name: name,
          //   email: "gaurav.kumar@example.com",
          //   contact: "9000090000",
          // },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } catch (error) {
        console.error("Error initiating payment:", error);

        throw new Error("Error initiating payment");
      }
    };
    initiatePayment();
  }, []);

  return null;
};

export default RazorpayPaymentComponent;
