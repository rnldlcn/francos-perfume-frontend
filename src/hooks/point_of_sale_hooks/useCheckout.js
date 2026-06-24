import { UseAuth } from "@/auth/UseAuth";
import { buildPointOfSaleDTO } from "@/utils/computations";
import { useState } from "react";

export const useCheckout = (cart, grandTotal, appliedDiscountId) => {
    const { user } = UseAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFinalCheckout = async (paymentDetails, onSuccess) => {
        setIsProcessing(true);
        try {
            const posDto = buildPointOfSaleDTO(paymentDetails, grandTotal, appliedDiscountId, cart);
        }

    }

    return { handleFinalCheckout, isProcessing}
}