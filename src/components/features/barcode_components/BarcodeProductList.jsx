import { useBarcode } from "@/hooks/product_hooks/useBarcode";
import { SearchBar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Printer, Download } from 'lucide-react';

export default function BarcodeProductList() {
  const {
    allProducts,
    asyncState,
    selectProduct,
    setPrintQty,
    printQty,
    searchProducts,
    regenerateBarcode,
    handlePrint,
    handleSavePdf,
    selectedProduct,
    barcodeValue,
    lastGenerated,
  } = useBarcode();

  const handleSearchChange = (value) => {
    const query = value?.target ? value.target.value : value;
    searchProducts(query);
  };

  if (asyncState.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-400">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg text-custom-black">Select Product</h2>
          <p className="text-sm text-gray-500">
            Search by name, display ID, or barcode
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              // TODO: implement create product flow if needed
              alert("Create product functionality will be implemented in a future update.");
            }}
            className="w-full sm:w-auto shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Product
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={asyncState.isLoading ? "" : (selectedProduct ? selectedProduct.product_name || "" : "")}
        onChange={handleSearchChange}
        placeholder="Search products..."
      />

      {/* Product List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {allProducts.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No products found.</p>
        ) : (
          <>
            {allProducts.map((product) => {
              const isSelected = selectedProduct?.product_id === product.product_id;
              return (
                <div
                  key={product.product_id}
                  onClick={() => selectProduct(product)}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "border-gray-400 bg-gray-50 shadow-sm ring-1 ring-gray-200"
                      : "border-gray-100 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="h-16 w-16 bg-white border border-gray-100 rounded flex items-center justify-center shrink-0 p-1">
                    <img
                      src={product.product_image_url || "/assets/FrancoPerfumeLogo.png"}
                      alt="Perfume"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{product.product_name}</h3>
                    <p className="text-xs text-gray-500 mb-1">{product.product_display_id}</p>
                    <p className="text-[11px] text-gray-400">
                      Barcode: <span className="font-mono text-gray-600">{product.product_barcode || "N/A"}</span>
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Date Created: {new Date(product.product_date_created).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-gray-400 mb-1">Last Generated:</p>
                    <p className="text-[11px] text-gray-600 font-medium">
                      {lastGenerated || "Never"}
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Selected Product Actions */}
      {selectedProduct && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{selectedProduct.product_name}</h3>
              <p className="text-sm text-gray-500">{selectedProduct.product_display_id}</p>
            </div>
            <div className="text-right space-x-3">
              <Button
                variant="outline"
                onClick={regenerateBarcode}
                disabled={asyncState.isGenerating}
                className="w-24 h-9"
              >
                {asyncState.isGenerating ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                disabled={asyncState.isPrinting}
                className="w-24 h-9"
              >
                {asyncState.isPrinting ? (
                  <Printer size={16} className="animate-spin" />
                ) : (
                  <Printer size={16} />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleSavePdf}
                disabled={asyncState.isSaving}
                className="w-24 h-9"
              >
                {asyncState.isSaving ? (
                  <Download size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
              </Button>
            </div>
          </div>

          {/* Print Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Print Quantity:
              <span className="text-xs text-gray-500">({printQty} label{printQty !== 1 ? "s" : ""})</span>
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setPrintQty((prev) => Math.max(1, prev - 1))}
                disabled={printQty <= 1}
                className="w-8 h-8"
              >
                <CheckCircle size={16} />
              </Button>
              <input
                type="number"
                value={printQty}
                onChange={(e) => setPrintQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center border border-gray-300 rounded"
                min="1"
              />
              <Button
                variant="ghost"
                onClick={() => setPrintQty((prev) => prev + 1)}
                className="w-8 h-8"
              >
                <XCircle size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}