import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatDateTimeForTable } from "@/utils/dateFormatUtils";

const TransactionsTable = ({ transactions, filter, isLoading, updateFilter, totalEntries, totalPages }) => {

    /*
    this template can be used for "void" function

        <TableCell className="text-right pr-4">
            <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs flex items-center gap-1.5 ml-auto"
            onClick={() => handleOpenEditBatchModal(batch, product)}>
            <Edit size={12} /> Edit Batch
            </Button>
        </TableCell>
    */

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow className="bg-gray-50/80">
                        <TableHead className="font-semibold text-gray-600">Date Received</TableHead>
                        <TableHead className="font-semibold text-gray-600">Sales Order ID</TableHead>
                        <TableHead className="font-semibold text-gray-600">Perfume Sold</TableHead>
                        <TableHead className="font-semibold text-gray-600">Processed By</TableHead>
                        <TableHead className="font-semibold text-gray-600 text-center">Payment Method</TableHead>
                        <TableHead className="font-semibold text-gray-600 text-center">Discount Applied</TableHead>
                        <TableHead className="font-semibold text-gray-600 text-right pr-6">Total Amount</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {(transactions || []).map((transaction) => (
                        <TableRow key={transaction.salesOrderId}>
                        <TableCell className="text-gray-600">{formatDateTimeForTable(transaction.transactionDate) || 'Unknown'}</TableCell>
                        <TableCell className="font-medium text-gray-700">{transaction.salesOrderId || 0}</TableCell>
                        <TableCell className="text-gray-600">
                            {transaction.productList?.length > 0 
                                ? transaction.productList.map(product => product.productName).join(', ')
                                : 'No products'
                            }
                        </TableCell>
                        <TableCell className="text-center text-gray-700">{transaction.processedBy}</TableCell>
                        <TableCell className="text-center text-gray-700">{transaction.paymentMethod}</TableCell>
                        <TableCell className="text-center text-gray-700">{transaction.discountName}</TableCell>
                        <TableCell className="text-center text-gray-700"><span className="text-green-700">+ ₱ {transaction.amount}</span></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {transactions.length > 0 && !isLoading && (
                <div className="flex justify-between items-center mt-auto pt-6 pb-2 text-sm text-gray-400">
                    <p>
                        Showing {((filter.pageCount - 1) * filter.pageSize) + 1} to {Math.min(filter.pageCount * filter.pageSize, totalEntries)} of {totalEntries} entries
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                        onClick={() => updateFilter('pageCount', Math.max(1, filter.pageCount - 1))}
                        disabled={filter.pageCount === 1}
                        className={`text-2xl transition-colors ${filter.pageCount === 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"}`}
                        >
                        ‹
                        </button>
                        <span className="text-gray-500 font-medium">{filter.pageCount} / {totalPages|| 1}</span>
                        <button
                        onClick={() => updateFilter('pageCount', Math.min(filter.pageCount + 1))}
                        disabled={filter.pageCount === totalPages}
                        className={`text-2xl transition-colors ${filter.pageCount === filter.totalPages ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"}`}>
                        ›
                        </button>
                    </div>
                </div>
            )}
        </div>
    ); 
}

export default TransactionsTable;