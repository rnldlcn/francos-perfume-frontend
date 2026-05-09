import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestService } from '../../services/RequestService';

export default function CreateTransferRequest() {
    const navigate = useNavigate();

    // Dynamically retrieve the branch ID from session storage established during login
    const currentUserBranchId = sessionStorage.getItem('branchId');

    // --- STATE MANAGEMENT ---
    const [inventory, setInventory] = useState([]);
    const [isLoadingInventory, setIsLoadingInventory] = useState(true);
    
    const [sourceBranch, setSourceBranch] = useState('');
    const [destinationBranch, setDestinationBranch] = useState('');
    
    const [selectedProductId, setSelectedProductId] = useState('');
    const [requestQty, setRequestQty] = useState(1);
    
    const [cart, setCart] = useState([]);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- INITIAL DATA FETCH ---
    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        setIsLoadingInventory(true);
        try {
            const token = sessionStorage.getItem('accessToken');
            
            // Connected to fixed backend port 5000
            const response = await fetch('http://localhost:5000/api/Inventory/displayAll?pageSize=100', {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Status ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            
            // Map result to the 'data' property returned by your C# backend
            if (result.data) {
                setInventory(result.data);
            } else {
                setInventory([]);
            }
        } catch (error) {
            console.error("Failed to load inventory:", error);
            alert("Could not load available products. Check the console for details.");
        } finally {
            setIsLoadingInventory(false);
        }
    };

    // --- CALCULATED UI LOGIC ---
    const selectedProductDetails = inventory.find(i => i.product_id === parseInt(selectedProductId));
    const availableQty = selectedProductDetails ? selectedProductDetails.product_qty : '--';
    const totalItems = cart.length;
    const totalUnits = cart.reduce((sum, item) => sum + item.requested_qty, 0);

    // Dynamic Badge logic: Inbound if destination is user's branch, otherwise Outbound
    let transferType = "PENDING SELECTION";
    let typeColorClasses = "bg-gray-100 text-gray-600 border-gray-200"; 

    if (sourceBranch && destinationBranch && sourceBranch !== destinationBranch) {
        if (destinationBranch === currentUserBranchId) {
            transferType = "INBOUND";
            typeColorClasses = "bg-blue-50 text-blue-800 border-blue-200"; 
        } else {
            transferType = "OUTBOUND";
            typeColorClasses = "bg-pink-50 text-pink-800 border-pink-200"; 
        }
    }

    // --- EVENT HANDLERS ---
    const handleAddToCart = () => {
        if (!selectedProductDetails) return alert("Select a product first.");
        if (requestQty <= 0) return alert("Quantity must be greater than 0.");
        
        if (requestQty > selectedProductDetails.product_qty) {
            return alert(`Quantity exceeds available stock (${selectedProductDetails.product_qty}).`);
        }

        const existingItem = cart.find(item => item.product_id === selectedProductDetails.product_id);
        if (existingItem) {
            const newTotalQty = existingItem.requested_qty + parseInt(requestQty);
            if (newTotalQty > selectedProductDetails.product_qty) {
                return alert("Total exceeds available stock.");
            }
            
            setCart(cart.map(item => 
                item.product_id === selectedProductDetails.product_id 
                ? { ...item, requested_qty: newTotalQty }
                : item
            ));
        } else {
            setCart([...cart, {
                product_id: selectedProductDetails.product_id,
                display_id: selectedProductDetails.product_display_id,
                name: selectedProductDetails.product_name,
                available: selectedProductDetails.product_qty,
                requested_qty: parseInt(requestQty)
            }]);
        }
        
        setSelectedProductId('');
        setRequestQty(1);
    };

    const handleRemoveFromCart = (productId) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    const handleSubmit = async () => {
        if (!sourceBranch || !destinationBranch) return alert("Select both branches.");
        if (sourceBranch === destinationBranch) return alert("Branches cannot be the same.");
        if (cart.length === 0) return alert("Add at least one product.");

        setIsSubmitting(true);
        try {
            // Updated payload structure to match your CreateRequestDTO
            const payload = {
                from_branch: parseInt(sourceBranch),
                to_branch: parseInt(destinationBranch),
                request_message: message,
                items: cart.map(item => ({
                    product_id: item.product_id,
                    requested_qty: item.requested_qty
                }))
            };

            await RequestService.createRequest(payload);
            
            alert("Transfer Request submitted successfully!");
            navigate('/home/requests'); 
            
        } catch (error) {
            console.error("Submission failed", error);
            alert(`Submission Error:\n${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat">
            <div className="mb-6 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-amber-100 text-amber-800 rounded font-semibold hover:bg-amber-200 transition-colors"
                >
                    &lt; Back
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Create Transfer Request</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Branch Info Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Branch Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1 font-medium">Source Branch (From)</label>
                                <select 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                                    value={sourceBranch}
                                    onChange={(e) => setSourceBranch(e.target.value)}
                                >
                                    <option value="">Select Source</option>
                                    <option value="1" disabled={destinationBranch === "1"}>Warehouse</option>
                                    <option value="2" disabled={destinationBranch === "2"}>Sta. Lucia</option>
                                    <option value="3" disabled={destinationBranch === "3"}>Riverbanks</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1 font-medium">Destination Branch (To)</label>
                                <select 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                                    value={destinationBranch}
                                    onChange={(e) => setDestinationBranch(e.target.value)}
                                >
                                    <option value="">Select Destination</option>
                                    {/* Warehouse (1) is disabled as a destination choice per project requirements */}
                                    <option value="2" disabled={sourceBranch === "2"}>Sta. Lucia</option>
                                    <option value="3" disabled={sourceBranch === "3"}>Riverbanks</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Selection Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Select Products to Request</h2>
                        
                        {isLoadingInventory ? (
                            <div className="py-4 text-center text-sm text-gray-500">Retrieving database inventory...</div>
                        ) : (
                            <>
                                <div className="flex items-end gap-4 mb-4">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1 font-medium">Product Name</label>
                                        <select 
                                            className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
                                            value={selectedProductId}
                                            onChange={(e) => setSelectedProductId(e.target.value)}
                                        >
                                            <option value="">-- Choose a product --</option>
                                            {inventory.map(item => (
                                                <option key={item.product_id} value={item.product_id}>
                                                    {item.product_display_id} - {item.product_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24 text-center">
                                        <label className="block text-[11px] text-gray-500 mb-1">Available</label>
                                        <div className="text-lg font-bold text-gray-800">{availableQty}</div>
                                    </div>
                                    <div className="w-32">
                                        <label className="block text-sm text-gray-600 mb-1 font-medium">Qty</label>
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button 
                                                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                                                onClick={() => setRequestQty(Math.max(1, requestQty - 1))}
                                            >-</button>
                                            <input 
                                                type="number" 
                                                className="w-full text-center outline-none p-2" 
                                                value={requestQty}
                                                onChange={(e) => setRequestQty(parseInt(e.target.value) || 1)}
                                            />
                                            <button 
                                                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                                                onClick={() => setRequestQty(requestQty + 1)}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full py-3 bg-[#E5D5C1] text-[#333] font-bold rounded-lg hover:bg-[#d4c2ab] transition-colors shadow-sm"
                                >
                                    Add Product
                                </button>
                            </>
                        )}
                    </div>

                    {/* Table Summary Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Requested Items</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-400 border-b border-gray-100">
                                        <th className="pb-3 font-medium">ID</th>
                                        <th className="pb-3 font-medium">Perfume Name</th>
                                        <th className="pb-3 font-medium text-center">Available</th>
                                        <th className="pb-3 font-medium text-center">Requested</th>
                                        <th className="pb-3 font-medium text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.length === 0 ? (
                                        <tr><td colSpan="5" className="py-8 text-center text-gray-400">Add products to your request to see them here.</td></tr>
                                    ) : (
                                        cart.map(item => (
                                            <tr key={item.product_id} className="border-b border-gray-50 last:border-0">
                                                <td className="py-4">
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                                                        {item.display_id}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-gray-700">{item.name}</td>
                                                <td className="py-4 text-center text-gray-600">{item.available}</td>
                                                <td className="py-4 text-center font-bold text-gray-800">{item.requested_qty}</td>
                                                <td className="py-4 text-center">
                                                    <button 
                                                        onClick={() => handleRemoveFromCart(item.product_id)}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Summary</h2>
                        
                        <div className={`text-center p-4 rounded-lg mb-4 text-sm border ${typeColorClasses}`}>
                            This will be an <br/>
                            <span className="font-bold text-base tracking-wide">{transferType}</span> request
                        </div>
                        
                        <div className="bg-blue-50 text-blue-800 text-center p-4 rounded-lg mb-6 text-sm border border-blue-100">
                            <span className="font-bold text-base">{totalItems}</span> product(s) | <span className="font-bold text-base">{totalUnits}</span> unit(s)
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Request Message</label>
                            <textarea 
                                className="w-full p-3 border border-gray-200 rounded-lg h-24 text-sm outline-none focus:border-blue-400 resize-none"
                                placeholder="Enter any notes for this request..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting || cart.length === 0 || !sourceBranch || !destinationBranch || sourceBranch === destinationBranch || transferType === "PENDING SELECTION"}
                            className={`w-full py-3.5 font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                                cart.length > 0 && sourceBranch && destinationBranch && sourceBranch !== destinationBranch && transferType !== "PENDING SELECTION" && !isSubmitting 
                                ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-sm' 
                                : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? "Processing..." : "Submit Request"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}