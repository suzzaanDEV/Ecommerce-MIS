import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {toast} from "@/components/ui/use-toast.js";

const initialState = {
    paymentURL: null,
    isLoading: false,
    orderId: null,
    orderList: [],
    orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
    "/order/createNewOrder",
    async (orderData, { rejectWithValue }) => {

        try {
            const response = await axios.post(
                "http://localhost:5000/api/shop/order/create",
                orderData,
                {
                    headers: {
                        Authorization: "Key 1d4555b002cf4589a3ae12d3a5630f64",
                    },
                }
            );

            // if (response.data?.url) {
            //     return response;
            // } else {
            //     return rejectWithValue("Payment initiation failed");
            // }

            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            return rejectWithValue("Error creating order");
        }
    }
);

export const capturePayment = createAsyncThunk(
    "/order/capturePayment",
    async ({ pidx, orderId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/shop/order/capture",
                {
                    pidx,
                    orderId,
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error capturing payment:", error);
            return rejectWithValue("Error capturing payment");
        }
    }
);

export const getAllOrdersByUserId = createAsyncThunk(
    "/order/getAllOrdersByUserId",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/shop/order/list/${userId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching orders:", error);
            return rejectWithValue("Error fetching orders");
        }
    }
);

export const getOrderDetails = createAsyncThunk(
    "/order/getOrderDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/shop/order/details/${id}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching order details:", error);
            return rejectWithValue("Error fetching order details");
        }
    }
);

const shoppingOrderSlice = createSlice({
    name: "shoppingOrderSlice",
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log("Response Data:", action.payload); // Log the response data

                if (action.payload?.payment_url && action.payload?.orderId) {
                    state.paymentURL = action.payload.payment_url;
                    state.orderId = action.payload.orderId;
                    sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));

                    // Delay redirection until state update is complete
                    setTimeout(() => {
                        window.location.href = action.payload.payment_url;
                    }, 1000);
                } else {
                    state.paymentURL = null;
                    state.orderId = null;
                    toast({
                        title: "Invalid response from the server.",
                        variant: "destructive",
                    });
                }
            })
            .addCase(createNewOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.paymentURL = null;
                state.orderId = null;
                console.log(action)
                console.error("Error:", action.payload);  // Log the error message
                toast({
                    title: action.payload || "An error occurred. Please try again.",
                    variant: "destructive",
                });
            })


            .addCase(getAllOrdersByUserId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
            })
            .addCase(getAllOrdersByUserId.rejected, (state, action) => {
                state.isLoading = false;
                state.orderList = [];
                console.error(action.payload);
            })
            .addCase(getOrderDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.orderDetails = null;
                console.error(action.payload);
            })
            .addCase(capturePayment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(capturePayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
            })
            .addCase(capturePayment.rejected, (state, action) => {
                state.isLoading = false;
                state.orderDetails = null;
                console.error(action.payload);
            });
    },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
