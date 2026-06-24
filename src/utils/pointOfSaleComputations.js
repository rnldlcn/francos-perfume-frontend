export const buildPointOfSaleDTO = (paymentDetails, grandTotal, appliedDiscountId) => {
    const received = String(paymentDetails.received ?? paymentDetails.amount ?? 0).replace(/,/g, '');
    const exactAmountPaid = paymentDetails.method
}

