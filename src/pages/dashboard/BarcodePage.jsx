import BarcodeProductList from "@/components/features/barcode_components/BarcodeProductList";
import BarcodePreview from "@/components/features/barcode_components/BarcodePreview";

export default function BarcodePage() {
    return (
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat flex flex-col">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-[32px] font-bold text-custom-black leading-none mb-1">Barcode Management</h1>
                <p className="text-custom-gray text-sm">Create, view, and manage product barcodes.</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">

                {/* LEFT COLUMN: Product Selection */}
                <div className="lg:col-span-7 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm p-4 overflow-hidden">
                    <BarcodeProductList />
                </div>

                {/* RIGHT COLUMN: Barcode Preview */}
                <div className="lg:col-span-5 h-fit sticky top-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:p-8 flex flex-col">
                        <BarcodePreview />
                    </div>
                </div>

            </div>
        </div>
    );
}