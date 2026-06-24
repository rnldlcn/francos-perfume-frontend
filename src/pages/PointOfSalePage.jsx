import { CashPaymentModal, CheckoutModal, DiscountModal, GCashPaymentModal, PointOfSaleFilterBar, ProductCard, ProductModal, ProfileDropdown } from '@/components/features/point_of_sale_components';
import { Button } from '@/components/ui/button';
import { useState } from 'react';


import { UseAuth } from '@/auth/UseAuth';
import { useInventory } from '@/hooks/inventory_hooks/useInventory';
import { useClock } from '@/hooks/useClock';

const PointOfSalePage = () => {
  const { user } = UseAuth();

  const { products, isLoading, error, filter, updateFilter } = useInventory(filter);
  const [isProcessing, setIsProcessing] = useState(false); 

  const [cart, setCart] = useState([]);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [appliedDiscountRate, setAppliedDiscountRate] = useState(0); 
  const [appliedDiscountId, setAppliedDiscountId] = useState(0); 
  

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showGCashModal, setShowGCashModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const currentDateTime = useClock();

  /*
  * section is for handling cart
  */
 
  const handleAddToCart = (product, quantity) => {
    
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product_id === product.product_id);
      if (existing) {
        return prevCart.map(item => 
          item.product_id === product.product_id 
            ? { ...item, cartQty: item.cartQty + quantity } 
            : item
        );
      }
      return [...prevCart, { ...product, name: product.product_name || product.name || 'Unknown Item', price: product.product_price || product.price || 0, cartQty: quantity }];
    });
    setSelectedProduct(null);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };


  // --- COMPUTATIONS ---
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);
  const discountAmount = subtotal * appliedDiscountRate;
  const grandTotal = subtotal - discountAmount;


  // --- 2. CHECKOUT SUBMISSION ---
  const handleFinalCheckout = async (paymentDetails) => {
    setIsProcessing(true);

    const exactGrandTotal = parseFloat(grandTotal.toFixed(2));
    const rawReceivedString = String(paymentDetails.received ?? paymentDetails.amount ?? 0).replace(/,/g, '');
    const exactAmountPaid = paymentDetails.method === 'Cash' 
        ? parseFloat(rawReceivedString) || 0
        : exactGrandTotal;

    const posDto = {
      payment_method: paymentDetails.method.toUpperCase(), 
      paymentMethod: paymentDetails.method.toUpperCase(), 
      amount_paid: exactAmountPaid, 
      amountPaid: exactAmountPaid, 
      reference_id: paymentDetails.referenceId || null, 
      referenceId: paymentDetails.referenceId || null, 
      discount_id: Number(appliedDiscountId) || 0,
      discountId: Number(appliedDiscountId) || 0,
      items: cart.map(item => ({
        product_id: item.product_id,
        productId: item.product_id,
        quantity: item.cartQty
      }))
    };

    try {
      const response = await fetch('http://localhost:5000/api/POS/checkout', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${user?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(posDto)
      });

      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      
      const receiptData = result?.receipt || result?.Receipt || result?.data?.receipt;

      if (!receiptData) {
        const fallbackId = result?.sales_order_display_id || "UNKNOWN";
        alert(`Transaction Successful!\nReceipt Number: ${fallbackId}`);
      } else {
        alert(`Transaction Successful!\nReceipt Number: ${receiptData?.receipt_number || 'N/A'}\nVAT: ₱${receiptData?.vatable_sales || 0}`);
      }
      
      setCart([]);
      setAppliedDiscountRate(0);
      setAppliedDiscountId(0);
      setShowCashModal(false);
      setShowGCashModal(false);
      setShowCheckoutModal(false);
      
    } catch (error) {
      alert(`Checkout Failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSelect = (method) => {
    setShowCheckoutModal(false);
    if (method === 'Cash') setShowCashModal(true);
    if (method === 'GCash') setShowGCashModal(true);
  };


  return (
    <div className="flex h-screen bg-[#0F172A] font-montserrat overflow-hidden relative text-slate-100">
      
      {/* LEFT PANEL: PRODUCT GRID */}
      <div className="flex-1 flex flex-col h-full pl-6 py-6 pr-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Point of Sale</h1>
            <p className="text-slate-400 text-sm">{currentDateTime}</p>
          </div>
          <div className="flex items-center gap-4">
            <ProfileDropdown />
          </div>
        </div>

        <PointOfSaleFilterBar filter={filter} updateFilter={updateFilter} />
        
        <div className="flex-1 overflow-y-auto pr-2 pb-20 custom-scrollbar">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-slate-500">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard 
                  key={product.product_id}
                  name={product.product_name || product.name}
                  type={product.product_type || product.type}
                  gender={product.product_gender || product.gender}
                  imageUrl={product.product_image_url || product.imageUrl}
                  price={product.product_price || product.price}
                  onAddToCart={() => setSelectedProduct(product)}
                  // Assuming ProductCard can handle a dark prop
                  isDarkMode={true} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: CART */}
      <div className="w-[400px] bg-[#111827] border-l border-slate-800 shadow-2xl flex flex-col h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Current Order</h2>
          <p className="text-sm text-slate-400">{cart.length} Items</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
              <span className="text-6xl mb-4">🛒</span>
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex-1">
                  <p className="font-bold text-slate-100 text-sm">{item.name}</p>
                  <p className="text-xs text-slate-400">₱{item.price} x {item.cartQty}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-emerald-400">₱{(item.price * item.cartQty).toLocaleString()}</p>
                  <button onClick={() => handleRemoveFromCart(item.product_id)} className="text-rose-500 hover:text-rose-400 font-bold transition-colors">×</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-[#0F172A] border-t border-slate-800">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>₱{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-emerald-500 font-medium">
              <span>Discount {appliedDiscountRate > 0 && `(${(appliedDiscountRate * 100)}%)`}</span>
              <span>- ₱{discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-white pt-2 border-t border-slate-800">
              <span>Total</span>
              <span>₱{grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button variant="outline" className="py-6 text-rose-500 border-rose-900/50 bg-rose-950/20 hover:bg-rose-950/40" disabled={cart.length === 0} onClick={() => setShowCancelConfirm(true)}>Cancel</Button>
            <Button variant="outline" className="py-6 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" disabled={cart.length === 0} onClick={() => setShowDiscountModal(true)}>Discount</Button>
          </div>
          <Button variant="success" className="w-full py-8 text-xl font-bold tracking-widest shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white border-none" disabled={cart.length === 0 || isProcessing} onClick={() => setShowCheckoutModal(true)}>
            {isProcessing ? "PROCESSING..." : "PAYMENT"}
          </Button>
        </div>
      </div>

      {/* --- MODALS (These will likely need their own internal dark mode logic) --- */}
      <ProductModal isOpen={!!selectedProduct} product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={handleAddToCart} />
      <DiscountModal isOpen={showDiscountModal} onClose={() => setShowDiscountModal(false)} onApply={(rate, id) => { setAppliedDiscountRate(rate); setAppliedDiscountId(id); setShowDiscountModal(false); }} />
      <CheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} grandTotal={grandTotal} onPaymentSelect={handlePaymentSelect} />
      
      <CashPaymentModal isOpen={showCashModal} onClose={() => setShowCashModal(false)} grandTotal={grandTotal} onConfirmPayment={handleFinalCheckout} />
      <GCashPaymentModal isOpen={showGCashModal} onClose={() => setShowGCashModal(false)} onConfirmPayment={handleFinalCheckout} />

      {/* Cancel Order Confirm */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-[400px] p-8 text-center">
            <h3 className="text-xl font-bold text-slate-100 mb-6">Cancel current order?</h3>
            <div className="flex gap-4 justify-center">
              <Button className="bg-rose-600 hover:bg-rose-500 text-white px-8" onClick={() => { setCart([]); setAppliedDiscountRate(0); setAppliedDiscountId(0); setShowCancelConfirm(false); }}>Yes</Button>
              <Button variant="outline" className="bg-slate-800 border-slate-700 text-slate-300" onClick={() => setShowCancelConfirm(false)}>No</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointOfSalePage;