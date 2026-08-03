import { FilterDropDown, SearchBar } from '@/components/shared';
import PaginationBar from '@/components/shared/PaginationBar';
import { Button } from '@/components/ui/button';
import { useProduct } from '@/hooks/product_hooks/useProduct';
import { Barcode, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';

export default function ProductsPage() {
    const { user } = useAuth();

    const { 
        products, 
        asyncState,
        pagination,
        filter,
        updateFilter
    } = useProduct();

    const isOwner = user?.trueRole?.toLowerCase() === 'owner';

    // --- PAGINATION & FILTER STATE ---
    const [searchQuery, setSearchQuery] = useState('');


    const initialFormState = {
        product_name: '',
        product_type: 'Classic',
        product_gender: 'Unisex',
        product_price: '',
        product_barcode: '',
        product_image_url: '/perfume_images/',
        product_description: ''
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [editId, setEditId] = useState(null);

    const handleInputChange = (e) => {
        
    };

    const openCreateModal = () => {
        
    };

    const openEditModal = () => {
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
    };

    const handleArchive = async () => {
        /*
        if (editStock > 0) {
            alert("Cannot archive this perfume because there are still stocks remaining.");
            return;
        }
        */
    };

    const handleSearchChange = (value) => {
        const query = value?.target ? value.target.value : value;
        setSearchQuery(query);
        updateFilter('search', query);
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat relative flex flex-col">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-custom-black">Products</h1>
                    <p className="text-sm text-foreground mt-1">List of all available products and details</p>
                </div>

                {isOwner && (
                    <Button>
                        <Plus className="w-8 h-8" />
                        Create New Product
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-4 flex-1 max-w-2xl">
                <SearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <FilterDropDown 
                    filter={filter}
                    updateFilter={updateFilter}
                    //filterOptions={filterOptions}
                />
            </div>

            {/* --- PRODUCT GRID --- */}
            products.length === 0 (
                <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm flex-1">
                    No products found matching your filters.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 content-start">
                    {products.map((product) => (
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
            )

            {/* --- PAGINATION CONTROLS --- */}
            <PaginationBar
                pageCount={filter.pageCount}
                pageSize={filter.pageSize}
                totalPages={pagination.totalPages}
                totalEntries={pagination.totalEntries}
                updateFilter={updateFilter}
            />

            {/* --- MODAL --- */}

        </div>
    );
}
