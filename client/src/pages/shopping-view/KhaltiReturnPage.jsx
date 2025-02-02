import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { capturePayment } from "@/store/shop/order-slice"; // Adjust the import path

function KhaltiReturnPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("pidx");
    const status = params.get("status");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (paymentId && status) {
            const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

            if (status === "Completed") {
                dispatch(capturePayment({ pidx: paymentId, orderId }))
                    .then((response) => {
                        if (response.payload?.success) {
                            sessionStorage.removeItem("currentOrderId");
                            window.location.href = "/shop/payment-success";
                        } else {
                            setError(response.payload.message || "Payment capture failed");
                        }
                    })
                    .catch((err) => {
                        // Display the error from the rejectWithValue
                        setError(err.payload || "An error occurred while processing your payment.");
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setError("Payment failed. Please try again.");
                setLoading(false);
            }
        } else {
            setError("Invalid payment details. Please check and try again.");
            setLoading(false);
        }
    }, [paymentId, status, dispatch]);

    return (
        <div className="p-4 text-center">
            {loading && <p className="text-lg">Processing your payment...</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default KhaltiReturnPage;
