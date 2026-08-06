
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
      <div className="grow flex justify-center items-center mb-4 h-40 bg-gray-50/50 rounded-lg overflow-hidden border border-gray-100 p-2">
        <img
          src={
            product.productImageUrl ||
            FrancoPerfumeLogo
          }
          alt={product.productName}
          className="h-full w-auto object-contain mix-blend-multiply"
        />
      </div>

      {/* Product Details */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
          <h3 className="font-bold text-lg text-custom-black leading-tight">
            {product.productName}
          </h3>
          <span className="text-[10px] text-gray-400 font-bold tracking-wider">
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
        <button
          onClick={() => onEdit(product)}
          className="mt-auto w-full py-2.5 bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 rounded-lg font-bold text-sm transition-colors shadow-sm"
        >
          Edit Details
        </button>
      )}
    </div>
  );
};