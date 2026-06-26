import { useState } from "react";

export const useCart = () => {
    const [cart, setCart] = useState([]);
    const [appliedDiscountRate, setAppliedDiscountRate] = useState(0);
    const [appliedDiscountId, setAppliedDiscountId] = useState(0);

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
        return [...prevCart, 
            { ...product, 
                name: product.product_name || 'Unknown Item', 
                price: product.product_price || 0, 
                cartQty: quantity 
            }];
        });
    };

    const handleRemoveFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
    };

    const handleClearCart = () => {
        setCart([]);
        setAppliedDiscountRate(0);
        setAppliedDiscountId(0);
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);
    const discountAmount = subtotal * appliedDiscountRate;
    const grandTotal = subtotal - discountAmount;

  return { cart, handleAddToCart, handleRemoveFromCart, handleClearCart, subtotal, discountAmount, grandTotal, appliedDiscountId, appliedDiscountRate, setAppliedDiscountId, setAppliedDiscountRate }
}