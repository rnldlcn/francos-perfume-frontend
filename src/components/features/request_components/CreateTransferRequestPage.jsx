
import { Button } from '@/components/ui/button';
import { useRequest } from '@/hooks/request_hooks/useRequest';
import { isValid, validateForm } from '@/utils/validationUtils';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BranchSelector from './create_transfer_components/BranchSelector';
import ProductList from './create_transfer_components/ProductList';
import ProductSelector from './create_transfer_components/ProductSelector';
import TransferSummary from './create_transfer_components/TransferSummary';

const INITIAL_DATA_STATE = {
    fromBranch: null,
    toBranch: null,
    requestMessage: null,
    items: []
}

const requestValidationSchema = {
    fromBranch: [isValid.required],
    toBranch: [isValid.required],
    requestMessage: [isValid.maxLength(255)],
    item: [
        (value) => (value.length == 0 ? "Please add at least one product" : null)
    ]
}

const CreateTransferRequestPage = () => {
    const navigate = useNavigate();

    const {
        fetchRequestFilters
    } = useRequest();

    // onChange={(value) => setData(prev => ({...prev, employeeShift: value }))}

    const [data, setData] = useState(INITIAL_DATA_STATE);

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);

    const [requestMessage, setRequestMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    const totalUnits = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
    

    const [branchOptions, setBranchOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);

    useEffect(() => {
        fetchRequestFilters().then(data => {
            if (!data) return;
            setBranchOptions((data.branchLocation).map(branch => ({
                value: branch.branchId,
                label: branch.branchLocation,
            })));
            setProductOptions((data.products).map(product => ({
                value: product.productId,
                label: product.productName,
            })));
        });
    }, [fetchRequestFilters]);

    const handleAddProduct = () => {
        if (!selectedProduct) return;

        console.log(selectedProduct);

        const selectedProductName = productOptions.find(product => product.value === selectedProduct.productId);        
        const selectedProductId = selectedProduct.productId;

        setData(prev => {
            const existingIndex = data.items.findIndex(p => p.productId === selectedProductId);
            
            let updatedItems = [...prev.items];

            if (existingIndex > 0) {
                updatedItems[existingIndex] = {
                    ...updatedItems[existingIndex],
                    quantity: updatedItems[existingIndex].quantity + quantity
                } 
            } else {
                updatedItems.push({
                    productId: selectedProductId,
                    productName: selectedProductName,
                    quantity: quantity
                })
            }

            return { ...prev, items: updatedItems };
        })
        setSelectedProduct('');
        setQuantity(1);
    };

    const handleRemoveProduct = (productId) => {
        setData(prev => ({
            ...prev,
            items: data.items.filter(p => p.productId !== productId)
        }));
    };

    const handleSubmit = async () => {
        const validationError = validateForm(data, requestValidationSchema);
        if (Object.keys(validationError).length > 0) {
            // POP UP ERROR HERE
            return;
        }

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
                        fromBranch={data.fromBranch}
                        toBranch={data.toBranch}
                        setFromBranch={(value) => setData(prev => ({ ...prev, fromBranch: value }))}
                        setToBranch={(value) => setData(prev => ({ ...prev, toBranch: value }))}
                        onClear={() => setData(prev => ({ ...prev, fromBranch: null, toBranch: null }))}
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
                        products={data.items}
                        onRemove={handleRemoveProduct}
                    />
                </div>

                <TransferSummary
                    fromBranch={data.fromBranch}
                    toBranch={data.toBranch}
                    productCount={data.items.length}
                    totalUnits={totalUnits}
                    message={requestMessage}
                    onMessageChange={setRequestMessage}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    branchOptions={branchOptions}
                />
            </div>
        </div>
    );
};

export default CreateTransferRequestPage;