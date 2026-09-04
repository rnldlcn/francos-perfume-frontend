import { useBarcode } from "@/hooks/product_hooks/useBarcode";
import { Button } from "@/components/ui/button";
import { RefreshCw, Printer, Download } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";

/**
 * BarcodePreview
 * ──────────────
 * Shows the selected product's barcode label with visual barcode lines,
 * print quantity controls, and action buttons.
 *
 * Extracted from BarcodePage so the page itself stays thin and delegates
 * to the hook for all state/actions.
 */
export default function BarcodePreview() {
    const {
        selectedProduct,
        barcodeValue,
        lastGenerated,
        printQty,
        asyncState,
        setPrintQty,
        regenerateBarcode,
        handlePrint,
        handleSavePdf,
    } = useBarcode();

    if (!selectedProduct) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="text-sm">Select a product to preview its barcode.</p>
            </div>
        );
    }

    const displayBarcode = barcodeValue || selectedProduct.product_barcode || "978-1-78280-808-4";
    const displayName = selectedProduct.product_name;
    const displayId = selectedProduct.product_display_id;

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Barcode Preview</h2>

            {/* Product info header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{displayName}</h3>
                    <p className="text-sm text-gray-500">{displayId}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Date Created: {new Date(selectedProduct.product_date_created).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Last Generated:</p>
                    <p className="text-sm font-medium text-gray-700">{lastGenerated || "Never"}</p>
                </div>
            </div>

            {/* Barcode label card */}
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-xl flex flex-col items-center w-full max-w-xs">
                    <p className="font-bold tracking-widest text-gray-800 mb-2 text-sm">
                        {displayName.toUpperCase().slice(0, 24)}
                    </p>

                    {/* CSS-simulated barcode lines */}
                    <div className="flex h-20 w-full justify-between items-end px-2 mb-2">
                        {Array.from({ length: 35 }, (_, i) => (
                            <div
                                key={i}
                                className="bg-black"
                                style={{
                                    width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1)}px`,
                                    height: i % 4 === 0 ? "100%" : "85%",
                                }}
                            />
                        ))}
                    </div>

                    <p className="font-mono text-base tracking-[0.25em] font-bold text-gray-800">
                        {displayBarcode}
                    </p>

                    {/* Print quantity */}
                    <div className="mt-6 flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-500">QTY:</span>
                        <input
                            type="number"
                            value={printQty}
                            onChange={(e) => setPrintQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 border border-gray-300 rounded p-1 text-center font-bold text-gray-700 outline-none focus:border-gray-500"
                            min="1"
                        />
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
                <Button
                    onClick={regenerateBarcode}
                    disabled={asyncState.isGenerating}
                    className="w-full bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 font-bold"
                >
                    <RefreshCw size={18} className={`mr-2 ${asyncState.isGenerating ? "animate-spin" : ""}`} />
                    {asyncState.isGenerating ? "Generating..." : "Regenerate Barcode"}
                </Button>
                <Button
                    onClick={handlePrint}
                    disabled={asyncState.isPrinting}
                    className="w-full bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 font-bold"
                >
                    <Printer size={18} className={`mr-2 ${asyncState.isPrinting ? "animate-spin" : ""}`} />
                    {asyncState.isPrinting ? "Printing..." : "Print Now"}
                </Button>
                <Button
                    onClick={handleSavePdf}
                    disabled={asyncState.isSaving}
                    className="w-full bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 font-bold"
                >
                    <Download size={18} className={`mr-2 ${asyncState.isSaving ? "animate-spin" : ""}`} />
                    {asyncState.isSaving ? "Saving..." : "Save as PDF"}
                </Button>
            </div>
        </div>
    );
}
