import React, { useState, useEffect } from 'react';
import { Plus, Barcode } from 'lucide-react';
import { UseAuth } from '../../services/UseAuth';
import { ProductService } from '../../services/ProductService'; 

export default function ProductsPage() {
    const { user } = UseAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🛡️ ROLE BASED ACCESS: Determines if the user is the Owner
    const isOwner = user?.activeRole?.toLowerCase() === 'owner';

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await ProductService.getAllProducts();
            setProducts(response.data || response); 
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-montserrat text-gray-500">Loading Products...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">List of all available products and details</p>
                </div>

                {/* 🛡️ SECURITY: Only Owners can create new products */}
                {isOwner && (
                    <button className="bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm">
                        <Plus size={18} strokeWidth={3} /> Create New Product
                    </button>
                )}
            </div>

            {products.length === 0 && !loading && (
                <div className="text-center py-20 text-gray-500">No products found in the database.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.product_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-full hover:shadow-md transition-shadow">
                        
                        {/* 🎨 NEW LAYOUT: Barcode on the Left, Price on the Right */}
                        <div className="flex justify-between items-center text-xs text-gray-400 mb-4 font-semibold">
                            <div className="flex items-center gap-1">
                                <Barcode size={14} />
                                <span className="tracking-widest font-mono">{product.product_barcode || 'N/A'}</span>
                            </div>
                            <span className="text-gray-500">₱{product.product_price?.toFixed(2) || '0.00'}</span>
                        </div>

                        {/* Product Image */}
                        <div className="flex-grow flex justify-center items-center mb-4 h-40 bg-gray-50/50 rounded-lg overflow-hidden border border-gray-100 p-2">
                            <img 
                                src={product.product_image_url || 'https://via.placeholder.com/150/fdf4f6/000000?text=No+Image'} 
                                alt={product.product_name} 
                                className="h-full w-auto object-contain mix-blend-multiply" 
                            />
                        </div>

                        {/* Product Details */}
                        <div className="mb-4">
                            <div className="flex justify-between items-end mb-1">
                                <h3 className="font-bold text-lg text-gray-800 leading-tight">{product.product_name}</h3>
                                <span className="text-[10px] text-gray-400 font-bold tracking-wider">
                                    {product.product_display_id}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-xs font-medium text-gray-500">
                                    {product.product_type || 'Unknown'} - {product.product_gender || 'Unisex'}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    {new Date(product.product_date_created).toLocaleDateString()}
                                </p>
                            </div>

                            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                                {product.product_description || 'No description available.'}
                            </p>
                        </div>

                        {/* 🛡️ SECURITY: Only Owners can edit products */}
                        {isOwner && (
                            <button className="mt-auto w-full py-2.5 bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 rounded-lg font-bold text-sm transition-colors shadow-sm">
                                Edit Details
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}