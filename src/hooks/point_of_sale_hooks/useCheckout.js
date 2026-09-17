import { useAuth } from "@/auth/UseAuth";
import { checkout } from "@/services/pointOfSaleService";
import { buildPointOfSaleDTO, extractReceiptData } from "@/utils/pointOfSaleDTO";
import { useState } from "react";

export const useCheckout = (cart, grandTotal, appliedDiscountId) => {
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFinalCheckout = async (paymentDetails, onSuccess) => {
        setIsProcessing(true);
        try {
            // Your DTO builder handles the strict JSON mapping
            const posDto = buildPointOfSaleDTO(paymentDetails, grandTotal, appliedDiscountId, cart);
            const result = await checkout(posDto, user?.accessToken);
            
            // Extract the receipt data
            const { receiptNumber, vat } = extractReceiptData(result);

            // Pass the data back to the UI instead of using a native alert
            if (onSuccess) {
                onSuccess({ receiptNumber, vat });
            }
        } catch (error) {
            // CRITICAL: You MUST throw the error here so PointOfSalePage can catch it
            throw error;
        } finally {
            setIsProcessing(false);
        }
    }

    return { handleFinalCheckout, isProcessing };
}