import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const ProductModal = ({ product, isOpen, onClose, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddClick = () => {
    onAdd(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all p-4">
      <div className="bg-card text-card-foreground rounded-md shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-border relative p-8">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X size={26} />
        </button>

        <div className="flex gap-6 mb-8 mt-2">
          
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-[22px] font-extrabold text-foreground uppercase leading-tight mb-4 pr-6 tracking-wide">
              {product.name}
            </h2>
            <p className="text-lg font-bold text-muted-foreground mb-6">
              Price: ₱{product.price.toLocaleString()}
            </p>

            <div className="flex items-center gap-4">
              <label className="text-[16px] text-foreground font-bold">Quantity:</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-secondary text-secondary-foreground font-bold rounded hover:bg-secondary/80 transition-colors text-xl"
                >
                  -
                </button>
                <div className="w-16 h-10 flex items-center justify-center border border-input rounded bg-transparent font-bold text-[18px] text-foreground">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-secondary text-secondary-foreground font-bold rounded hover:bg-secondary/80 transition-colors text-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="w-40 h-40 shrink-0 rounded-md overflow-hidden bg-muted shadow-inner flex items-center justify-center relative">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-20 h-28 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-t-full shadow-2xl opacity-80"></div>
            )}
          </div>

        </div>

        <button 
          onClick={handleAddClick}
          className="w-full bg-primary text-primary-foreground font-extrabold py-3.5 rounded hover:bg-primary/90 transition-colors tracking-widest text-[16px] shadow-sm"
        >
          ADD TO CHECKOUT
        </button>

      </div>
    </div>
  );
};

export default ProductModal;