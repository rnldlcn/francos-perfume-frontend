import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Printer, Download } from 'lucide-react';
import { UseAuth } from "../../services/UseAuth";
import perfumePlaceholder from "../../assets/FrancoPerfumeLogo.png"; // Fallback image

export default function BarcodePage() {
    const { user } = UseAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [printQty, setPrintQty] = useState(1);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // Fetching from your existing Inventory endpoint to guarantee it works immediately
                const response = await fetch('http://localhost:5000/api/Inventory/displayAll?pageSize=500', {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${user?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error("Failed to fetch");

                const result = await response.json();
                
                // Filter out branch duplicates to create a clean "Master Product" list
                const uniqueProducts = [];
                const seenIds = new Set();

                (result.data || []).forEach(item => {
                    if (!seenIds.has(item.product_id)) {
                        seenIds.add(item.product_id);
                        uniqueProducts.push(item);
                    }
                });

                setProducts(uniqueProducts);
                
                // Auto-select the first product if available
                if (uniqueProducts.length > 0) {
                    setSelectedProduct(uniqueProducts[0]);
                }

            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [user?.accessToken]);

    // --- FILTER LOGIC ---
    const filteredProducts = products.filter(p => {
        const query = searchQuery.toLowerCase();
        return (
            (p.product_name || "").toLowerCase().includes(query) ||
            (p.product_display_id || "").toLowerCase().includes(query) ||
            (p.product_barcode || "").includes(query)
        );
    });

    // --- CAPSTONE 2 PLACEHOLDER HANDLERS ---
    const handleCapstone2Feature = (featureName) => {
        alert(`${featureName} functionality will be implemented in Capstone 2!`);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat flex flex-col">
            
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-[32px] font-bold text-gray-800 leading-none mb-1">Barcode Management</h1>
                <p className="text-gray-500 text-sm">Create, remove, and adjust barcodes.</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
                
                {/* LEFT COLUMN: Product Selection */}
                <div className="lg:col-span-5 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm p-4 overflow-hidden">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Select Perfume</h2>
                    
                    {/* Search Bar */}
                    <div className="relative mb-4 shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or id..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 text-sm"
                        />
                    </div>

                    {/* Scrollable Product List */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {isLoading ? (
                            <p className="text-center text-gray-400 py-10 text-sm">Loading products...</p>
                        ) : filteredProducts.length === 0 ? (
                            <p className="text-center text-gray-400 py-10 text-sm">No products found.</p>
                        ) : (
                            filteredProducts.map(product => {
                                const isSelected = selectedProduct?.product_id === product.product_id;
                                
                                return (
                                    <div 
                                        key={product.product_id}
                                        onClick={() => setSelectedProduct(product)}
                                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                            isSelected 
                                            ? 'border-gray-400 bg-gray-50 shadow-sm ring-1 ring-gray-200' 
                                            : 'border-gray-100 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="h-16 w-16 bg-white border border-gray-100 rounded flex items-center justify-center shrink-0 p-1">
                                            <img 
                                                src={product.product_image_url || perfumePlaceholder} 
                                                alt="Perfume" 
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800 truncate">{product.product_name}</h3>
                                            <p className="text-xs text-gray-500 mb-1">{product.product_display_id}</p>
                                            <p className="text-[11px] text-gray-400">
                                                Barcode: <span className="font-mono text-gray-600">{product.product_barcode || 'N/A'}</span>
                                            </p>
                                            <p className="text-[11px] text-gray-400">
                                                Date Created: {new Date(product.product_date_created).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] text-gray-400 mb-1">Last Generated:</p>
                                            <p className="text-[11px] text-gray-600 font-medium">11/04/2026</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Barcode Preview */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:p-8 h-full flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Barcode Preview</h2>
                        
                        {selectedProduct ? (
                            <div className="flex-1 flex flex-col">
                                
                                {/* Info Header */}
                                <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-100">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{selectedProduct.product_name}</h3>
                                        <p className="text-sm text-gray-500">{selectedProduct.product_display_id}</p>
                                        <p className="text-xs text-gray-400 mt-1">Date Created: {new Date(selectedProduct.product_date_created).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Last Generated:</p>
                                        <p className="text-sm font-medium text-gray-700">11/04/2026</p>
                                    </div>
                                </div>

                                {/* Placeholder Barcode Graphic */}
                                <div className="flex-1 flex flex-col items-center justify-center mb-10">
                                    <div className="bg-white border-2 border-dashed border-gray-300 p-8 rounded-xl flex flex-col items-center w-full max-w-sm">
                                        <p className="font-bold tracking-widest text-gray-800 mb-2">SAMPLE ONLY</p>
                                        <p className="font-mono text-sm tracking-[0.2em] text-gray-600 mb-3">
                                            {selectedProduct.product_barcode || '978-1-78280-808-4'}
                                        </p>
                                        
                                        {/* CSS Simulated Barcode Lines */}
                                        <div className="flex h-24 w-full justify-between items-end px-4 mb-2">
                                            {[...Array(40)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className="bg-black" 
                                                    style={{ 
                                                        width: `${Math.random() * 3 + 1}px`, 
                                                        height: Math.random() > 0.8 ? '100%' : '85%' 
                                                    }}
                                                ></div>
                                            ))}
                                        </div>

                                        <p className="font-mono text-lg tracking-[0.3em] font-bold text-gray-800">
                                            {selectedProduct.product_barcode || '9781782 808084'}
                                        </p>
                                        
                                        <div className="mt-6 flex items-center gap-3">
                                            <span className="text-sm font-bold text-gray-500">QTY:</span>
                                            <input 
                                                type="number" 
                                                value={printQty} 
                                                onChange={(e) => setPrintQty(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-16 border border-gray-300 rounded p-1 text-center font-bold text-gray-700 outline-none focus:border-gray-500"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 mt-auto">
                                    <button 
                                        onClick={() => handleCapstone2Feature("Regenerate Barcode")}
                                        className="w-full py-3.5 bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw size={18} /> Regenerate Barcode
                                    </button>
                                    <button 
                                        onClick={() => handleCapstone2Feature("Print")}
                                        className="w-full py-3.5 bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Printer size={18} /> Print Now
                                    </button>
                                    <button 
                                        onClick={() => handleCapstone2Feature("Save as PDF")}
                                        className="w-full py-3.5 bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download size={18} /> Save as PDF
                                    </button>
                                </div>

                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                {isLoading ? "Loading..." : "Select a perfume from the left to preview its barcode."}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}