import ProductGrid from '@/components/features/product_components/ProductGrid';
import { FilterDropDown, SearchBar } from '@/components/shared';
import PaginationBar from '@/components/shared/PaginationBar';
import { Button } from '@/components/ui/button';
import { useProduct } from '@/hooks/product_hooks/useProduct';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../auth/UseAuth';

export default function ProductsPage() {
    const { user } = useAuth();
    const { 
        products,
        asyncState,
        pagination,
        filter,
        updateFilter,
        filterOptions,
        // THESE FUNCTIONS BELOW ARE ALREADY CONNECTED WITH THE BACKEND SERVICE. PLEASE CHECK THE useProducts HOOK FOR MORE DETAILED INFORMATION.
        getProduct,
        updateDetails,
        createProduct
    } = useProduct();

    const isOwner = user?.trueRole === 'OWNER';
    const [searchQuery, setSearchQuery] = useState('');
    
    // PLEASE CREATE SEPARATE COMPONENTS FOR THESE. PUT IT UNDER THE product_components FOLDER UNDER components/features
    // CHECK THE MANAGEACCOUNTSPAGE AND ITS PATTERN. FOLLOW HOW THE MANAGEACCOUNTSPAGE WAS MADE. 

    const openCreateModal = () => {
        
    };

    const openEditModal = () => {
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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
            </div>

            <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-xl">
                <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                />
            </div>

            {isOwner && (
                <Button
                    //onClick={() => setIsCreateAccountModalOpen(true)}
                    className="w-full sm:w-auto shrink-0"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Product
                </Button>
            )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <FilterDropDown 
                filter={filter}
                updateFilter={updateFilter}
                filterOptions={filterOptions}
                />
            </div>
            </div>

            <ProductGrid 
                products={products}
                isOwner={isOwner}
                //openEditModal={openEditModal}
            />
            
            <PaginationBar
                pageCount={filter.pageCount}
                pageSize={filter.pageSize}
                totalPages={pagination.totalPages}
                totalEntries={pagination.totalEntries}
                updateFilter={updateFilter}
            />


        </div>
    );
}
