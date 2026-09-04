
import { Button } from "@/components/ui/button";
import { formatDateForTable, formatLabel } from "@/utils/formattingUtils";
import { Barcode } from "lucide-react";
import FrancoPerfumeLogo from '../../../assets/FrancoPerfumeLogo.png';

export const ProductCard = ({ product, isOwner, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center text-xs text-foreground mb-4 font-semibold">
        <div className="flex items-center gap-1">
          <Barcode size={14} />
          <span className="tracking-widest font-mono">
            {product.productBarcode || "N/A"}
          </span>
        </div>
        <span className="text-gray-foreground">
          ₱{product.productPrice?.toFixed(2) || "0.00"}
        </span>
      </div>

      {/* Product Image */}
      <div className="grow flex justify-center items-center mb-8 bg-background rounded-lg overflow-hidden border border-gray-100 p-2">
        <img
          src={
            product.productImageUrl ||
            FrancoPerfumeLogo
          }
          alt={product.productName}
          className="h-32 w-32 object-contain mix-blend-multiply"
        />
      </div>

      {/* Product Details */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
          <h3 className="font-bold text-sm text-custom-black leading-tight">
            {product.productName}
          </h3>
          <span className="text-xs text-gray-400 font-bold tracking-wider">
            {product.productDisplayId}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-medium text-custom-black uppercase">
            {formatLabel(product.productType)} -{" "}
            {formatLabel(product.productGender)}
          </p>
          <p className="text-sm text-gray-foreground">
            {formatDateForTable(product.productDateCreated)}
          </p>
        </div>

        <p className="text-xs text-foreground line-clamp-3 leading-relaxed">
          {product.productDescription || "No description available."}
        </p>
      </div>

      {/* Action */}
      {isOwner && (
        <Button
          //onClick={() => onEdit(product)}
        >
          Edit Details
        </Button>
      )}
    </div>
  );
};