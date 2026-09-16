import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const ProductList = ({ products, onRemove }) => {
    if (!products.length) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Added Products</h2>
            <div className="space-y-2">
                {products.map((product) => (
                    <div
                        key={product.productId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                        <div>
                            <p className="font-medium text-foreground text-sm">{product.productName}</p>
                            <p className="text-xs text-muted-foreground">{product.productDisplayId}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-foreground">
                                {product.quantity} units
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                onClick={() => onRemove(product.productId)}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;