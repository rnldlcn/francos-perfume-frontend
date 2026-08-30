
import { useAuth } from '@/auth/UseAuth';
import { Button } from '@/components/ui/button';
import { useRequest } from '@/hooks/request_hooks/useRequest';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BranchSelector from './create_transfer_components/BranchSelector';
import ProductList from './create_transfer_components/ProductList';
import ProductSelector from './create_transfer_components/ProductSelector';
import TransferSummary from './create_transfer_components/TransferSummary';

const CreateTransferRequestPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        filterOptions
    } = useRequest();

    const [fromBranch, setFromBranch] = useState('');
    const [toBranch, setToBranch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addedProducts, setAddedProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalUnits = addedProducts.reduce((sum, item) => sum + item.quantity, 0);
    
    const branchOptions = filterOptions.branchLocation || [];
    const productOptions = filterOptions.products || [];

    const handleAddProduct = () => {
        if (!selectedProduct) return;
        
        const existing = addedProducts.find(p => p.productId === selectedProduct);
        if (existing) {
            setAddedProducts(prev => prev.map(p =>
                p.productId === selectedProduct
                    ? { ...p, quantity: p.quantity + quantity }
                    : p
            ));
        } else {
            setAddedProducts(prev => [...prev, {
                productId: selectedProduct,
                productName: '...', // get from product options
                quantity,
            }]);
        }
        setSelectedProduct('');
        setQuantity(1);
    };

    const handleRemoveProduct = (productId) => {
        setAddedProducts(prev => prev.filter(p => p.productId !== productId));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // call your request service here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full font-montserrat animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Back
                </Button>
                <h1 className="text-2xl font-bold text-custom-black">Create Transfer Request</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <BranchSelector
                        fromBranch={fromBranch}
                        toBranch={toBranch}
                        onFromChange={setFromBranch}
                        onToBranch={setToBranch}
                        onClear={() => { setFromBranch(''); setToBranch(''); }}
                        branchOptions={branchOptions}
                    />
                    <ProductSelector
                        selectedProduct={selectedProduct}
                        onProductChange={setSelectedProduct}
                        quantity={quantity}
                        onQtyChange={setQuantity}
                        availableQty={null}
                        productOptions={productOptions}
                        onAddProduct={handleAddProduct}
                    />
                    <ProductList
                        products={addedProducts}
                        onRemove={handleRemoveProduct}
                    />
                </div>

                <TransferSummary
                    fromBranch={fromBranch}
                    toBranch={toBranch}
                    userBranchId={user?.branchId}
                    productCount={addedProducts.length}
                    totalUnits={totalUnits}
                    message={message}
                    onMessageChange={setMessage}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
};

export default CreateTransferRequestPage;