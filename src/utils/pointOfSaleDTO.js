// change name from build to something else because it sounds confusing as hell
export const buildPointOfSaleDTO = (paymentDetails, grandTotal, appliedDiscountId, cart) => {
    const received = String(paymentDetails.received ?? paymentDetails.amount ?? 0).replace(/,/g, '');
    const exactAmountPaid = paymentDetails.method === 'Cash'
    ? parseFloat(received) || 0
    : parseFloat(grandTotal.toFixed(2));

    return {
        payment_method: paymentDetails.method.toUpperCase(),
        amount_paid: exactAmountPaid,
        discount_id: appliedDiscountId || 0,
        items: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }))
    };
};

export const extractReceiptData = (result) => {
    const receiptData = result?.receipt || result?.Receipt || result?.data?.receipt;
    const receiptNumber = receiptData?.receipt_number || result?.sales_order_display_id || 'UNKNOWN';
    const vat = receiptData?.vatable_sales || 0;
    return { receiptNumber, vat };
};