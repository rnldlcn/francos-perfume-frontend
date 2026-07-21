import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { Button } from "@/components/ui/button";
import { useAuditLog } from "@/hooks/audit_hooks/useAuditLog";
import { formatDateTimeForTable } from "@/utils/dateFormatUtils";
import { ChevronLeft, ChevronRight, Download, Eye, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

const AuditLogTable = () => {
  const { auditLogs, isLoading, filter, totalPages, totalEntries, fetchAuditLogs, updateFilter } = useAuditLog();

  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);


  const handleExport = async () => {
    try {
      setIsExporting(true);
      // --- UNCOMMENT WHEN BACKEND IS READY ---
      // const response = await fetch('YOUR_API_URL/audit/inventory/export', { method: 'GET' });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `inventory_audit_logs.csv`;
      // a.click();

      // Simulated delay for UI template
      setTimeout(() => setIsExporting(false), 1500);
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // --- UNCOMMENT WHEN BACKEND IS READY ---
      // const formData = new FormData();
      // formData.append('file', file);
      // await fetch('YOUR_API_URL/audit/inventory/import', {
      //   method: 'POST',
      //   body: formData,
      // });
      // alert("Import successful!");
      
      console.log("File ready for import:", file.name);
    } catch (error) {
      console.error("Import failed:", error);
    }
    // Reset file input so you can upload the same file again if needed
    event.target.value = null; 
  };


  return (
    <section className="mb-12">
      
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm min-h-[200px] mb-4">
        <Table>
          <TableHeader>
          <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600">Log ID</TableHead>
              <TableHead className="font-semibold text-gray-600">Employee ID</TableHead>
              <TableHead className="font-semibold text-gray-600">Branch ID</TableHead>
              <TableHead className="font-semibold text-gray-600">Module</TableHead>
              <TableHead className="font-semibold text-gray-600 text-center">Action</TableHead>
              <TableHead className="font-semibold text-gray-600 text-center">Timestamp</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
          {(auditLogs || []).map((log) => (
              <TableRow key={log.logId}>
              <TableCell className="text-gray-600">{log.logDisplayId}</TableCell>
              <TableCell className="font-medium text-gray-700">{log.employeeDisplayId}</TableCell>
              <TableCell className="font-medium text-gray-700">{log.branchDisplayId}</TableCell>
              <TableCell className="text-gray-600">{log.logModule}</TableCell>
              <TableCell className="text-center text-gray-700">{log.logAction}</TableCell>
              <TableCell className="text-center text-gray-700">{formatDateTimeForTable(log.logTimestamp) || 'Unknown'}</TableCell>
              </TableRow>
              ))}
          </TableBody>
      </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium mr-1">Actions:</span>
          
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Eye className="mr-2" size={16} /> View All
          </Button>
          
          <Button variant="primary" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Download className="mr-2" size={16} />}
            {isExporting ? "Exporting..." : "Export"}
          </Button>

          <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".csv, .xlsx" />
          <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2" size={16} /> Import
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Button variant="ghost" size="icon-sm" className="hover:bg-transparent">
            <ChevronLeft size={20} />
          </Button>
          <span>N/A</span>
          <Button variant="ghost" size="icon-sm" className="hover:bg-transparent">
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>


    </section>
  );
};

export default AuditLogTable;
