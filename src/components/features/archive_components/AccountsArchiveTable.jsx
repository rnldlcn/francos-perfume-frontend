import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useAccountArchive } from "@/hooks/archive_hooks/useAccountArchive";
import { formatDateTimeForTable } from "@/utils/dateFormatUtils";
import { ArchiveRestore, Eye } from "lucide-react";
import { useState } from "react";

const AccountsArchiveTable = () => {
  
  const { archivedAccounts, isLoading, filter, totalPages, totalEntries, fetchArchivedAccounts, updateFilter } = useAccountArchive();

  const [isModalOpen, setIsModalOpen] = useState(false); 

  /*
    TO BE DECIDED: WHETHER OR NOT THE MODAL SHOULD BE ADDED
      <ViewArchiveModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Inventory Archives List"
        columns={["ID", "Perfume Name", "Perfume Type", "Note", "Gender", "Branch", "Date and Time Archived"]}
        data={archives}
        renderRow={renderRow}
      />
  */

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#333] mb-6">Accounts Archives</h2>
      
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm min-h-[200px] mb-4">
        <Table>
          <TableHeader>
          <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600">Employee ID</TableHead>
              <TableHead className="font-semibold text-gray-600">Branch</TableHead>
              <TableHead className="font-semibold text-gray-600">Email</TableHead>
              <TableHead className="font-semibold text-gray-600">Role</TableHead>
              <TableHead className="font-semibold text-gray-600 text-center">Date Archived</TableHead>
              <TableHead className="font-semibold text-gray-600 text-center">Archived By</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
          {(archivedAccounts || []).map((account) => (
              <TableRow key={account.accountArchiveId}>
              <TableCell className="text-gray-600">account.employeeDisplayId</TableCell>
              <TableCell className="font-medium text-gray-700">{account.branchId}</TableCell>
              <TableCell className="text-gray-600">{account.email}</TableCell>
              <TableCell className="text-center text-gray-700">{account.employeeRole}</TableCell>
              <TableCell className="text-center text-gray-700">{formatDateTimeForTable(account.dateArchived) || 'Unknown'}</TableCell>
              <TableCell className="text-center text-gray-700">{account.archivedBy}</TableCell>
              </TableRow>
              ))}
          </TableBody>
      </Table>
      </div>

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
      
    </section>
  );
};

export default AccountsArchiveTable;