import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductArchive } from "@/hooks/archive_hooks/useProductArchive";
import { formatDateTimeForTable } from "@/utils/dateFormatUtils";


import { useState } from "react";

const ProductsArchiveTable = () => {

  const { archivedProducts, isLoading, filter, totalPages, totalEntries, fetchArchivedAccounts, updateFilter } = useProductArchive();
  
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State

  /*
    USE THIS IF FRONTEND IS FINALIZED

   <ViewArchiveModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Accounts Archives List"
        columns={["ID", "Name", "Email", "Role", "Branch", "Date and Time Archived"]}
        data={archives}
        renderRow={renderRow}
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium">Actions:</span>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Eye className="mr-2" size={16} /> View All
          </Button>
          <Button variant="destructive-outline">
            <ArchiveRestore className="mr-2" size={16} /> Restore selected
          </Button>
        </div>
      </div>
  */
 
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#333] mb-6">Products Archives</h2>
      
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm min-h-[200px] mb-4">
        <Table>
          <TableHeader>
          <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600">Product ID</TableHead>
              <TableHead className="font-semibold text-gray-600">Product Name</TableHead>
              <TableHead className="font-semibold text-gray-600">Date Archived</TableHead>
              <TableHead className="font-semibold text-gray-600">Archived By</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
          {(archivedProducts || []).map((product) => (
              <TableRow key={product.productArchiveId}>
              <TableCell className="text-gray-600">{product.productDisplayId}</TableCell>
              <TableCell className="font-medium text-gray-700">{product.productName}</TableCell>
              <TableCell className="text-gray-600">{formatDateTimeForTable(product.dateArchived)}</TableCell>
              <TableCell className="font-medium text-gray-700">{product.archivedBy}</TableCell>
              </TableRow>
              ))}
          </TableBody>
      </Table>
      </div>
    </section>
  );
};

export default ProductsArchiveTable;