import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDateTimeForTable } from "@/utils/dateFormatUtils";

const AccountsTable = ({accounts, selectedAccount, handleRowClick}) => {
    /*
        <div className="flex justify-between items-center mt-auto pt-6 text-sm text-gray-400">
            {selectedAccount && (
                <div className="flex items-center gap-3 px-4 py-3 g-[#F5EFE8] border-t border-gray-200">
                        <span className="flex-1 text-sm text-gray-500">
                            <span className="font-semibold text-[#333]">{selectedAccount.employeeFullName}</span> selected
                        </span>
                        <Button size="sm" variant="outline" onClick={() => setIsEditModalOpen(true)}>
                            Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-rose-500 border-rose-200" onClick={() => setIsArchiveModalOpen(true)}>
                            Archive
                        </Button> 
                </div>
            )}
        </div>
    */

    return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm min-h-[50] mb-4">
        <Table>
          <TableHeader>
          <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-custom-gray">Employee ID</TableHead>
              <TableHead className="font-semibold text-custom-gray">Email</TableHead>
              <TableHead className="font-semibold text-custom-gray">Name</TableHead>
              <TableHead className="font-semibold text-custom-gray">Branch</TableHead>
              <TableHead className="font-semibold text-custom-gray">Address</TableHead>
              <TableHead className="font-semibold text-custom-gray">Role</TableHead>
              <TableHead className="font-semibold text-custom-gray text-center">Contact Number</TableHead>
              <TableHead className="font-semibold text-custom-gray text-center">Creation Date</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
          {(accounts || []).map((account) => (
            <TableRow key={account.employeeId}
                onClick={() => handleRowClick(account)}
                className={`cursor-pointer transition-colors 
                ${selectedAccount?.employeeId === account.employeeId
                ? 'bg-blue-200 border-1-2'
                : 'hover:bg-gray-50'}`}>
                <TableCell className="text-custom-gray">{account.employeeDisplayId}</TableCell>
                <TableCell className="text-custom-gray">{account.email}</TableCell>
                <TableCell className="font-medium text-custom-gray">{account.employeeFullName}</TableCell>
                <TableCell className="font-medium text-custom-gray">{account.branchDisplayId}</TableCell>
                <TableCell className="font-medium text-custom-gray">{account.address}</TableCell>
                <TableCell className="text-custom-gray">{account.employeeRole}</TableCell>
                <TableCell className="text-custom-gray">{account.contactNumber}</TableCell>
                <TableCell className="text-custom-gray">{formatDateTimeForTable(account.accountCreated)}</TableCell>
            </TableRow>
              ))}
          </TableBody>
      </Table>
      </div>
    )
}

export default AccountsTable;