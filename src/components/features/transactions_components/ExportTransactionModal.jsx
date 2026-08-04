import CloseButton from "@/components/shared/CloseButton";
import { useExportReport } from "@/hooks/transaction_hooks/useExportReport";
import { FileOutput, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useState } from "react";


const ExportTransactionModal = ({ isOpen, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const { exportExcel, exportPdf, isError } = useExportReport();

  const handleExport = async () => {
    if (!selectedFormat) return;

    setIsExporting(true);
    if(selectedFormat === 'pdf') {
      exportPdf();
    }

    if(selectedFormat === 'xlsx') {
      exportExcel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-8 relative">
        <CloseButton 
          onClick={onClose}
        />
        {/* CLOSE BUTTON */}
        

        <h2 className="text-3xl font-bold text-center text-[#333] mb-8 tracking-tight">
          Export To:
        </h2>

        {/* FORMAT SELECTION CARDS */}
        <div className="flex justify-center gap-6 mb-8">
          {/* PDF OPTION */}
          <button 
            onClick={() => setSelectedFormat('pdf')}
            className={`flex flex-col items-center justify-center p-6 w-32 h-32 rounded-xl border-2 transition-all ${
              selectedFormat === 'pdf' 
                ? 'border-gray-800 bg-gray-50 scale-105 shadow-md' 
                : 'border-transparent hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <FileText size={56} className="text-[#333] mb-2" strokeWidth={1.5} />
            <span className="font-bold text-[#333] text-xl tracking-wide">PDF</span>
          </button>

          {/* EXCEL OPTION */}
          <button 
            onClick={() => setSelectedFormat('xlsx')}
            className={`flex flex-col items-center justify-center p-6 w-32 h-32 rounded-xl border-2 transition-all ${
              selectedFormat === 'xlsx' 
                ? 'border-gray-800 bg-gray-50 scale-105 shadow-md' 
                : 'border-transparent hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <FileSpreadsheet size={56} className="text-[#333] mb-2" strokeWidth={1.5} />
            <span className="font-bold text-[#333] text-xl tracking-wide">EXCEL</span>
          </button>

          {/* CSV OPTION */}
          <button 
            onClick={() => setSelectedFormat('csv')}
            className={`flex flex-col items-center justify-center p-6 w-32 h-32 rounded-xl border-2 transition-all ${
              selectedFormat === 'csv' 
                ? 'border-gray-800 bg-gray-50 scale-105 shadow-md' 
                : 'border-transparent hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <FileOutput size={56} className="text-[#333] mb-2" strokeWidth={1.5} />
            <span className="font-bold text-[#333] text-xl tracking-wide">CSV</span>
          </button>
        </div>

        {/* DATE RANGE INPUTS */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-3">Select a date (optional):</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Date From:</p>
              <div className="relative">
                <input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400" 
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Date To:</p>
              <div className="relative">
                <input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center">
          <button 
            onClick={handleExport}
            disabled={!selectedFormat || isExporting}
            className={`bg-[#E5D5C1] text-gray-800 px-8 py-3 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 min-w-[200px] ${
              !selectedFormat || isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d4c2ab]'
            }`}
          >
            {isExporting && <Loader2 size={16} className="animate-spin" />}
            {isExporting ? "Exporting..." : "Continue to export"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExportTransactionModal;