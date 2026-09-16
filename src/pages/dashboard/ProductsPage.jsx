import { Archive, Barcode, Check, Filter, Image as ImageIcon, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { ProductService } from '../../services/productService';

export default function ProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const isOwner = user?.activeRole?.toLowerCase() === 'owner';

    // --- PAGINATION & FILTER STATE ---
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGender, setFilterGender] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    // --- MODAL STATE ---
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Track stock to prevent archiving
    const [editStock, setEditStock] = useState(0); 

    const initialFormState = {
        product_name: '',
        product_type: 'Standard',
        product_gender: 'Unisex',
        product_price: '',
        product_barcode: '',
        product_image_url: '/perfume_images/',
        product_description: ''
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [editId, setEditId] = useState(null);

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

    // --- 🔧 INDESTRUCTIBLE FILTERING LOGIC ---
    const filteredProducts = products.filter(p => {
        // 1. Search Filter
        const matchesSearch = (p.product_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (p.product_display_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (p.product_barcode || '').includes(searchQuery);
        
        // 2. Type Filter (Using UI fallback logic)
        const dbType = String(p.product_type || p.type || 'Unknown').trim().toLowerCase();
        const uiType = String(filterType).trim().toLowerCase();
        const matchesType = uiType === 'all' || uiType === 'all types' || dbType === uiType;

        // 3. Gender Filter (Using UI fallback logic)
        // If the DB is blank, it defaults to 'unisex' to match what the user actually sees on screen
        const dbGender = String(p.product_gender || p.gender || 'Unisex').trim().toLowerCase();
        const uiGender = String(filterGender).trim().toLowerCase();

        let matchesGender = false;
        if (uiGender === 'all' || uiGender === 'all genders') {
            matchesGender = true;
        } else if (uiGender === 'men') {
            // Catches any variation of male/men from the database
            matchesGender = ['men', 'male', 'm'].includes(dbGender);
        } else if (uiGender === 'women') {
            // Catches any variation of female/women
            matchesGender = ['women', 'female', 'woman', 'f'].includes(dbGender);
        } else if (uiGender === 'unisex') {
            // Catches unisex, or defaults if the DB was blank
            matchesGender = ['unisex', 'u', 'both', 'any'].includes(dbGender);
        } else {
            matchesGender = dbGender === uiGender;
        }

        return matchesSearch && matchesGender && matchesType;
    });

    // Reset to page 1 whenever filters or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterGender, filterType]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // --- FORM HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'product_type' && value === 'Premium') {
                newData.product_gender = 'Unisex';
            }
            return newData;
        });
    };

    const openCreateModal = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditId(null);
        setEditStock(0);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setFormData({
            product_name: product.product_name,
            product_type: product.product_type,
            product_gender: product.product_gender || product.gender || 'Unisex',
            product_price: product.product_price,
            product_barcode: product.product_barcode,
            product_image_url: product.product_image_url,
            product_description: product.product_description
        });
        setIsEditing(true);
        setEditId(product.product_id);
        setEditStock(product.total_stock || 0); 
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...formData, product_price: parseFloat(formData.product_price) };

            if (isEditing) {
                await ProductService.updateProduct(editId, payload);
                alert("Product updated successfully!");
            } else {
                await ProductService.addProduct(payload);
                alert("Product created successfully!");
            }
            
            setShowModal(false);
            loadProducts(); 
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleArchive = async () => {
        if (editStock > 0) {
            alert("Cannot archive this perfume because there are still stocks remaining.");
            return;
        }

        if (window.confirm(`Are you sure you want to archive ${formData.product_name}?`)) {
            setIsSubmitting(true);
            try {
                await ProductService.archiveProduct(editId);
                alert("Product archived successfully.");
                setShowModal(false);
                loadProducts();
            } catch (error) {
                alert(error.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (loading) return <div className="p-10 text-center font-montserrat text-gray-500">Loading Products...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat relative flex flex-col">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">List of all available products and details</p>
                </div>

                {isOwner && (
                    <button onClick={openCreateModal} className="bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap">
                        <Plus size={18} strokeWidth={3} /> Create New Product
                    </button>
                )}
            </div>

            {/* --- SEARCH & FILTER BAR --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name, ID, or barcode..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 text-sm shadow-sm"
                    />
                </div>
                
                <div className="flex gap-4">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)}
                            className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 text-sm shadow-sm appearance-none cursor-pointer text-gray-700 font-medium"
                        >
                            <option value="All">All Types</option>
                            <option value="Standard">Standard</option>
                            <option value="Premium">Premium</option>
                            <option value="Signature">Signature</option>
                        </select>
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                            value={filterGender} 
                            onChange={(e) => setFilterGender(e.target.value)}
                            className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 text-sm shadow-sm appearance-none cursor-pointer text-gray-700 font-medium"
                        >
                            <option value="All">All Genders</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- PRODUCT GRID --- */}
            {filteredProducts.length === 0 && !loading ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm flex-1">
                    No products found matching your filters.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 content-start">
                    {currentProducts.map((product) => (
                        <div key={product.product_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-full hover:shadow-md transition-shadow">
                            
                            <div className="flex justify-between items-center text-xs text-gray-400 mb-4 font-semibold">
                                <div className="flex items-center gap-1">
                                    <Barcode size={14} />
                                    <span className="tracking-widest font-mono">{product.product_barcode || 'N/A'}</span>
                                </div>
                                <span className="text-gray-500">₱{product.product_price?.toFixed(2) || '0.00'}</span>
                            </div>

                            <div className="flex-grow flex justify-center items-center mb-4 h-40 bg-gray-50/50 rounded-lg overflow-hidden border border-gray-100 p-2">
                                <img 
                                    src={product.product_image_url || 'https://via.placeholder.com/150/fdf4f6/000000?text=No+Image'} 
                                    alt={product.product_name} 
                                    className="h-full w-auto object-contain mix-blend-multiply" 
                                />
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between items-end mb-1">
                                    <h3 className="font-bold text-lg text-gray-800 leading-tight">{product.product_name}</h3>
                                    <span className="text-[10px] text-gray-400 font-bold tracking-wider">
                                        {product.product_display_id}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                        {product.product_type || 'Unknown'} - {product.product_gender || product.gender || 'Unisex'}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        {new Date(product.product_date_created).toLocaleDateString()}
                                    </p>
                                </div>

                                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                                    {product.product_description || 'No description available.'}
                                </p>
                            </div>

                            {isOwner && (
                                <button onClick={() => openEditModal(product)} className="mt-auto w-full py-2.5 bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 rounded-lg font-bold text-sm transition-colors shadow-sm">
                                    Edit Details
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* --- PAGINATION CONTROLS --- */}
            {filteredProducts.length > 0 && (
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 shrink-0">
                    <span className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} entries
                    </span>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`text-2xl transition-colors ${currentPage === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            ‹
                        </button>
                        <span className="text-sm font-medium text-gray-600">{currentPage} / {totalPages || 1}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`text-2xl transition-colors ${currentPage === totalPages || totalPages === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
                        
                        <div className="flex justify-between items-center p-6 pb-2">
                            <h2 className="text-xl font-bold text-gray-800">
                                {isEditing ? 'Edit Perfume' : 'Create New Perfume'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 pt-4">
                            <form id="perfumeForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col md:flex-row gap-8 mb-6">
                                    <div className="flex flex-col items-center justify-start">
                                        <div className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center relative bg-gray-50 overflow-hidden">
                                            {formData.product_image_url && formData.product_image_url !== '/perfume_images/' ? (
                                                <img src={formData.product_image_url} alt="Preview" className="w-full h-full object-contain mix-blend-multiply p-2" />
                                            ) : (
                                                <ImageIcon size={48} className="text-gray-400" />
                                            )}
                                        </div>
                                        <input 
                                            type="text" 
                                            name="product_image_url" 
                                            value={formData.product_image_url} 
                                            onChange={handleInputChange} 
                                            className="mt-3 text-[10px] w-32 p-1 border border-gray-200 rounded text-center text-gray-500 outline-none focus:border-[#C8B285]" 
                                            placeholder="Image URL" 
                                        />
                                        <input 
                                            type="text" 
                                            name="product_barcode" 
                                            value={formData.product_barcode} 
                                            onChange={handleInputChange} 
                                            className="mt-2 text-[10px] w-32 p-1 border border-gray-200 rounded text-center text-gray-500 outline-none focus:border-[#C8B285]" 
                                            placeholder="Barcode No." 
                                        />
                                    </div>

                                    <div className="flex-grow space-y-4 text-sm">
                                        <div className="flex items-center gap-4">
                                            <label className="w-32 text-gray-500 font-medium text-right">Perfume Name:</label>
                                            <input required type="text" name="product_name" value={formData.product_name} onChange={handleInputChange} className="flex-grow p-2 border border-gray-300 rounded focus:border-[#C8B285] outline-none text-gray-700" placeholder="Enter New Perfume Name" />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-32 text-gray-500 font-medium text-right">Perfume Type:</label>
                                            <select name="product_type" value={formData.product_type} onChange={handleInputChange} className="flex-grow p-2 border border-gray-300 rounded focus:border-[#C8B285] outline-none text-gray-700 bg-white">
                                                <option value="Standard">Standard</option>
                                                <option value="Premium">Premium</option>
                                                <option value="Signature">Signature</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-32 text-gray-500 font-medium text-right">Gender:</label>
                                            <select 
                                                name="product_gender" 
                                                value={formData.product_gender} 
                                                onChange={handleInputChange} 
                                                disabled={formData.product_type === 'Premium'} 
                                                className={`flex-grow p-2 border border-gray-300 rounded outline-none text-gray-700 bg-white ${formData.product_type === 'Premium' ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'focus:border-[#C8B285]'}`}
                                            >
                                                <option value="Men">Men</option>
                                                <option value="Women">Women</option>
                                                <option value="Unisex">Unisex</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-32 text-gray-500 font-medium text-right">Price (₱):</label>
                                            <input required type="number" step="0.01" min="0" name="product_price" value={formData.product_price} onChange={handleInputChange} className="flex-grow p-2 border border-gray-300 rounded focus:border-[#C8B285] outline-none text-gray-700" placeholder="Enter Price" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-500 font-medium mb-2">Description:</label>
                                    <textarea name="product_description" value={formData.product_description} onChange={handleInputChange} rows="4" className="w-full p-3 border border-gray-300 rounded focus:border-[#C8B285] outline-none resize-none text-gray-700 text-sm" placeholder="Enter description..."></textarea>
                                </div>
                            </form>
                        </div>

                        <div className={`p-6 pt-0 flex mt-2 ${isEditing ? 'justify-between' : 'justify-end'}`}>
                            {isEditing ? (
                                <button 
                                    type="button" 
                                    onClick={handleArchive} 
                                    disabled={editStock > 0 || isSubmitting}
                                    title={editStock > 0 ? "Cannot archive: Stock remaining across branches." : "Archive Perfume"}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#8A1C33] hover:bg-[#6b1426] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Archive size={18} strokeWidth={2.5} /> Archive Perfume
                                </button>
                            ) : (
                                <button type="button" onClick={() => setShowModal(false)} className="flex items-center gap-2 px-6 py-2.5 bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 font-semibold rounded-lg transition-colors mr-4">
                                    <X size={18} strokeWidth={3} /> Discard Changes
                                </button>
                            )}

                            <button type="submit" form="perfumeForm" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 font-semibold rounded-lg transition-colors disabled:opacity-50">
                                <Check size={18} strokeWidth={3} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}