import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

function PaymentSuccessPage() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
            <Card className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                <CardHeader className="p-0 flex items-center justify-center mb-4">
                    <CheckCircleIcon className="text-green-500 w-16 h-16" />
                </CardHeader>
                <CardTitle className="text-3xl font-semibold text-center text-gray-900">
                    Payment Successful!
                </CardTitle>
                <p className="text-center text-lg text-gray-600 mt-2 mb-6">
                    Your payment was successfully processed. Thank you for your purchase.
                </p>
                <div className="text-center">
                    <Button
                        className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                        onClick={() => navigate("/shop/account")}
                    >
                        View Orders
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default PaymentSuccessPage;
