import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
import { useState } from "react";
import perfumePlaceholder from "../../../assets/FrancoPerfumeLogo.png";
import { formatDateForInput, formatDateForTable } from '../../../utils/dateFormatUtils';

const InventoryRow = ({inventory, isLoading, totalPages, totalEntries, fetchBatchesForProduct, batchMap, setBatchMap, filter, updateFilter, handleOpenEditBatchModal}) => {

    const [expandedRows, setExpandedRows] = useState({});
    
    const toggleRow = (rowKey) => {
        setExpandedRows((prev) => ({ ...prev, [rowKey]: !prev[rowKey] }));
    };

    const handleToggleRow = async(productId, branchId, rowKey) => {
    toggleRow(rowKey);        
        if (!batchMap[rowKey]) {
        const batches = await fetchBatchesForProduct(productId, branchId);
        console.log(batches);
        const mapped = (batches || []).map(b => ({
            batchId: b.batchId,
            dateReceived: b.createdAt,
            targetDate: b.expiryDate
                    ? formatDateForInput(b.expiryDate)  
                    : 'N/A',
            quantity: b.quantity
        }))
        setBatchMap(prev => ({...prev, [rowKey]: mapped}))
        }
    }


    return (
        <>
        <div className="flex flex-col gap-4 pb-4 flex-1">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400">Loading inventory data...</div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No products found.</div>
        ) : (
          inventory.map((product) => {
            const rowKey = `${product.productDisplayId}-${product.branchName}`;
            const isExpanded = expandedRows[rowKey];
            const displayUnits = product.productQuantity || 0;
            const totalBatches = product.productBatchCount || 0;
            const isLowStock = displayUnits > 0 && displayUnits < 10;

            return (
              <div key={rowKey} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all shrink-0">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleToggleRow(product.productId, product.branchId, rowKey)}>
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400 p-2">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    
                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                      <img src={product.productImageUrl || perfumePlaceholder} alt="Product" className="object-cover h-10 w-10 opacity-60" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-[#333] leading-none">{product.productName || "Unknown Product"}</h3>
                        {isLowStock && <Badge variant="destructive" className="h-5 text-[10px] uppercase font-bold tracking-wider">⚠️ Low Stock</Badge>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`h-5 border text-xs ${product.branchName?.toUpperCase() === 'WAREHOUSE' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                          {product.branchName?.toUpperCase() || "UNKNOWN BRANCH"}
                        </Badge>
                        <Badge variant="outline" className="h-5 bg-blue-50 text-blue-700 border-blue-200">{product.productType}</Badge>
                        <Badge variant="outline" className="h-5 bg-pink-50 text-pink-700 border-pink-200">{product.productGender}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pr-4">
                    <p className="font-bold text-[#333] text-lg">{displayUnits} units</p>
                    <p className="text-xs text-gray-500">{totalBatches} batches</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                    {totalBatches === 0 ? (
                      <div className="text-center py-6 font-bold text-gray-400 bg-white border border-gray-200 rounded-md tracking-widest text-sm">
                        NO AVAILABLE BATCH FOUND
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/80">
                              <TableHead className="font-semibold text-gray-600">Batch ID</TableHead>
                              <TableHead className="font-semibold text-gray-600">Date Received</TableHead>
                              <TableHead className="font-semibold text-gray-600">Target Date</TableHead>
                              <TableHead className="font-semibold text-gray-600 text-center">Quantity</TableHead>
                              <TableHead className="font-semibold text-gray-600 text-right pr-6">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(batchMap[rowKey] || []).map((batch) => (
                              <TableRow key={batch.batchId}>
                                <TableCell className="font-medium text-gray-700">{batch.batchId || 0}</TableCell>
                                <TableCell className="text-gray-600">{formatDateForTable(batch.dateReceived) || 0}</TableCell>
                                <TableCell className="text-gray-600">{batch.targetDate || 0}</TableCell>
                                <TableCell className="text-center text-gray-700">{batch.quantity || 0}</TableCell>
                                <TableCell className="text-right pr-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 text-xs flex items-center gap-1.5 ml-auto"
                                    onClick={() => handleOpenEditBatchModal(batch, product)}>
                                    <Edit size={12} /> Edit Batch
                                  </Button>
                                </TableCell>
                              </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {inventory.length > 0 && !isLoading && (
        <div className="flex justify-between items-center mt-auto pt-6 pb-2 text-sm text-gray-400">
          <p>
            Showing {((filter.page - 1) * filter.pageSize) + 1} to {Math.min(filter.page * filter.pageSize, totalEntries)} of {totalEntries} entries
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateFilter('page', Math.max(1, filter.page - 1))}
              disabled={filter.page === 1}
              className={`text-2xl transition-colors ${filter.page === 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"}`}
            >
              ‹
            </button>
            <span className="text-gray-500 font-medium">{filter.page} / {totalPages|| 1}</span>
            <button
              onClick={() => updateFilter('page', Math.min(filter.page + 1))}
              disabled={filter.page === totalPages}
              className={`text-2xl transition-colors ${filter.page === filter.totalPages ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"}`}>
            ›
            </button>
          </div>
        </div>
      )}
      </>
        
    )
}

export default InventoryRow;