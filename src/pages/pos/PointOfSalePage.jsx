import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import logo from '../../assets/FrancoPerfumeLogo.png';
import CashPaymentModal from '../../components/features/pos_components/CashPaymentModal';
import CheckoutModal from '../../components/features/pos_components/CheckoutModal';
import DiscountModal from '../../components/features/pos_components/DiscountModal';
import GCashPaymentModal from '../../components/features/pos_components/GCashPaymentModal';
import ProductCard from '../../components/features/pos_components/ProductCard';
import ProductModal from '../../components/features/pos_components/ProductModal';
import ProfileDropdown from '../../components/shared/ProfileDropdown';

const PointOfSalePage = ({ user, onLogout, onSwitchAccess }) => {
  const canSwitchAccess = user?.trueRole === 'manager';

  const [products, setProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); 

  const [cart, setCart] = useState([]);
  const [activeType, setActiveType] = useState('ALL'); 
  const [activeGender, setActiveGender] = useState('ALL'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [appliedDiscountRate, setAppliedDiscountRate] = useState(0); 
  const [appliedDiscountId, setAppliedDiscountId] = useState(0); 
  
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showGCashModal, setShowGCashModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/Products/branch/${user?.branchId || sessionStorage.getItem('branchId')}/pos`, {
          headers: { 'Authorization': `Bearer ${user?.accessToken}` }
        });
        
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching POS inventory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleAddToCart = (product, quantity) => {
    const cleanPrice = Number(product.product_price || product.price || 0);
    const cleanName = product.product_name || product.name || 'Unknown Item';

    setCart(prevCart => {
      const existing = prevCart.find(item => item.product_id === product.product_id);
      if (existing) {
        return prevCart.map(item => 
          item.product_id === product.product_id 
            ? { ...item, cartQty: item.cartQty + quantity } 
            : item
        );
      }
      return [...prevCart, { ...product, name: cleanName, price: cleanPrice, cartQty: quantity }];
    });
    setSelectedProduct(null);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);
  const discountAmount = subtotal * appliedDiscountRate;
  const grandTotal = subtotal - discountAmount;

  const handleFinalCheckout = async (paymentDetails) => {
    setIsProcessing(true);

    const exactGrandTotal = parseFloat(grandTotal.toFixed(2));
    const rawReceivedString = String(paymentDetails.received ?? paymentDetails.amount ?? 0).replace(/,/g, '');
    const exactAmountPaid = paymentDetails.method === 'Cash' 
        ? parseFloat(rawReceivedString) || 0
        : exactGrandTotal;

    // 🔧 Dual-Payload ensures C# binds everything perfectly
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

  const filteredProducts = products.filter(p => {
    const pName = p.product_name || p.name || '';
    const pType = p.product_type || p.type || '';
    const pGender = p.product_gender || p.gender || '';

    const matchesSearch = pName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeType === 'ALL' || pType === activeType;
    const matchesGender = activeGender === 'ALL' || pGender === activeGender;
    return matchesSearch && matchesType && matchesGender;
  });

  return (
    <div className="flex h-screen bg-[#F4F7FB] font-montserrat overflow-hidden relative">
      <div className="flex-1 flex flex-col h-full pl-6 py-6 pr-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#333]">Point of Sale</h1>
            <p className="text-gray-500 text-sm">{currentDateTime}</p>
          </div>
          <div className="flex items-center gap-4">
            <ProfileDropdown user={user} onLogout={onLogout} onSwitchAccess={canSwitchAccess ? onSwitchAccess : undefined} />
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5A9B5C]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-20 custom-scrollbar">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-gray-400">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.product_id}
                  name={product.product_name || product.name}
                  type={product.product_type || product.type}
                  gender={product.product_gender || product.gender}
                  imageUrl={product.product_image_url || product.imageUrl}
                  price={product.product_price || product.price}
                  onAddToCart={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-[400px] bg-white border-l border-gray-200 shadow-xl flex flex-col h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#333]">Current Order</h2>
          <p className="text-sm text-gray-500">{cart.length} Items</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <span className="text-6xl mb-4">🛒</span>
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <p className="font-bold text-[#333] text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">₱{item.price} x {item.cartQty}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-[#333]">₱{(item.price * item.cartQty).toLocaleString()}</p>
                  <button onClick={() => handleRemoveFromCart(item.product_id)} className="text-red-400 hover:text-red-600 font-bold">×</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₱{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount {appliedDiscountRate > 0 && `(${(appliedDiscountRate * 100)}%)`}</span>
              <span>- ₱{discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-[#333] pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>₱{grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button variant="outline" className="py-6 text-red-500 border-red-200 hover:bg-red-50" disabled={cart.length === 0} onClick={() => setShowCancelConfirm(true)}>Cancel</Button>
            <Button variant="outline" className="py-6" disabled={cart.length === 0} onClick={() => setShowDiscountModal(true)}>Discount</Button>
          </div>
          <Button variant="success" className="w-full py-8 text-xl font-bold tracking-widest shadow-lg" disabled={cart.length === 0 || isProcessing} onClick={() => setShowCheckoutModal(true)}>
            {isProcessing ? "PROCESSING..." : "PAYMENT"}
          </Button>
        </div>
      </div>

      <ProductModal isOpen={!!selectedProduct} product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={handleAddToCart} />
      <DiscountModal isOpen={showDiscountModal} onClose={() => setShowDiscountModal(false)} onApply={(rate, id) => { setAppliedDiscountRate(rate); setAppliedDiscountId(id); setShowDiscountModal(false); }} />
      <CheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} grandTotal={grandTotal} onPaymentSelect={handlePaymentSelect} />
      
      <CashPaymentModal isOpen={showCashModal} onClose={() => setShowCashModal(false)} grandTotal={grandTotal} onConfirmPayment={handleFinalCheckout} />
      <GCashPaymentModal isOpen={showGCashModal} onClose={() => setShowGCashModal(false)} onConfirmPayment={handleFinalCheckout} />

      {showCancelConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-[400px] p-8 text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-6">Cancel current order?</h3>
            <div className="flex gap-4 justify-center">
              <Button variant="destructive" onClick={() => { setCart([]); setAppliedDiscountRate(0); setAppliedDiscountId(0); setShowCancelConfirm(false); }}>Yes</Button>
              <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>No</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointOfSalePage;