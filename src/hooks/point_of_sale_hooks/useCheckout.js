import { useAuth } from "@/auth/UseAuth";
import { checkout } from "@/services/PointOfSaleService";
import { buildPointOfSaleDTO, extractReceiptData } from "@/utils/pointOfSaleDTO";
import { useState } from "react";

export const useCheckout = (cart, grandTotal, appliedDiscountId) => {
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFinalCheckout = async (paymentDetails, onSuccess) => {
        setIsProcessing(true);
        try {
            const posDto = buildPointOfSaleDTO(paymentDetails, grandTotal, appliedDiscountId, cart);
            const result = await checkout(posDto, user?.accessToken);
            const { receiptNumber, vat } = extractReceiptData(result);

            alert(`Transaction Successful!\nReceipt Number: ${receiptNumber || 'N/A'}\nVAT: ₱${vat|| 0}`);
            onSuccess();
        } catch (error) {
            alert(`Checkout failed: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    }

    return { handleFinalCheckout, isProcessing}
}