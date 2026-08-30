import FormSelect from '@/components/shared/FormSelect';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

const ProductSelector = ({ 
    selectedProduct, 
    onProductChange, 
    quantity, 
    onQtyChange,
    availableQty,
    productOptions,
    onAddProduct,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Select Products to Request</h2>
            
            <div className="flex items-end gap-4 mb-4">
                <div className="flex-1">
                    <FormSelect
                        value={selectedProduct}
                        onChange={onProductChange}
                        options={productOptions}
                        placeholder="Select product..."
                    />
                </div>

                {/* Available Qty */}
                <div className="text-center min-w-[80px]">
                    <p className="text-xs text-muted-foreground mb-1 leading-tight">
                        Available Qty in<br/>Source Branch
                    </p>
                    <p className="font-bold text-foreground">
                        {availableQty ?? '--'}
                    </p>
                </div>

                {/* Qty Controls */}
                <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Qty to Request</p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onQtyChange(Math.max(1, quantity - 1))}
                        >
                            <Minus size={14} />
                        </Button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => onQtyChange(Number(e.target.value))}
                            className="w-14 text-center border border-gray-300 rounded-md p-1 text-sm font-bold"
                            min={1}
                            max={availableQty}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onQtyChange(Math.min(availableQty ?? Infinity, quantity + 1))}
                        >
                            <Plus size={14} />
                        </Button>
                    </div>
                </div>
            </div>

            <Button
                className="w-full bg-custom-primary text-custom-black hover:bg-custom-primary-50-opacity"
                onClick={onAddProduct}
                disabled={!selectedProduct}
            >
                Add Product
            </Button>
        </div>
    );
};

export default ProductSelector;