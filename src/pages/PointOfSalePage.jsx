import { CancelConfirmModal, CashPaymentModal, CheckoutModal, DiscountModal, GCashPaymentModal, PointOfSaleFilterBar, ProductCard, ProductModal } from '@/components/features/point_of_sale_components';
import { ProfileDropdown } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { useCart } from '@/hooks/point_of_sale_hooks/useCart';
import { useCheckout } from '@/hooks/point_of_sale_hooks/useCheckout';
import { usePointOfSale } from '@/hooks/point_of_sale_hooks/usePointOfSale';
import { useClock } from '@/hooks/useClock';

const PointOfSalePage = () => {
  const { products, isLoading, filter, updateFilter } = usePointOfSale();

  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showGCashModal, setShowGCashModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const currentDateTime = useClock();
  const { cart, handleAddToCart, handleRemoveFromCart, handleClearCart, subtotal, discountAmount, grandTotal, appliedDiscountId, appliedDiscountRate, setAppliedDiscountId, setAppliedDiscountRate } = useCart();

  const { handleFinalCheckout, isProcessing } = useCheckout(cart, grandTotal, appliedDiscountId);    

  const handlePaymentSelect = (method) => {
    setShowCheckoutModal(false);
    if (method === 'Cash') setShowCashModal(true);
    if (method === 'GCash') setShowGCashModal(true);
  };

  const onConfirmPayment= (paymentDetails) => {
    handleFinalCheckout(paymentDetails, () => {
      handleClearCart();
      setAppliedDiscountRate(0);
      setAppliedDiscountId(0);
      setShowCashModal(false);
      setShowGCashModal(false);
      setShowCheckoutModal(false);
    });
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
      <CashPaymentModal isOpen={showCashModal} onClose={() => setShowCashModal(false)} grandTotal={grandTotal} onConfirmPayment={onConfirmPayment} />
      <GCashPaymentModal isOpen={showGCashModal} onClose={() => setShowGCashModal(false)} onConfirmPayment={onConfirmPayment} />

      <CancelConfirmModal isOpen={showCancelConfirm} 
        onConfirm={() => {
          handleClearCart();
          setAppliedDiscountRate(0);
          setAppliedDiscountId(0);
          setShowCancelConfirm(false);
        }}
        onClose={()=> setShowCancelConfirm(false) } />
    </div>
  );
};

export default PointOfSalePage;