import PaginationBar from "@/components/shared/PaginationBar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatDateTimeForTable } from "@/utils/dateFormatUtils";

const TransactionsTable = ({ transactions, asyncState, pagination, filter, updateFilter }) => {

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
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow className="bg-gray-50/80">
                        <TableHead className="font-semibold text-muted-foreground">Date Received</TableHead>
                        <TableHead className="font-semibold text-muted-foreground">Sales Order ID</TableHead>
                        <TableHead className="font-semibold text-muted-foreground">Perfume Sold</TableHead>
                        <TableHead className="font-semibold text-muted-foreground">Processed By</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-center">Payment Method</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-center">Discount Applied</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-right pr-6">Total Amount</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {(transactions || []).map((transaction) => (
                        <TableRow key={transaction.salesOrderId}>
                        <TableCell className="text-primary-foreground">{formatDateTimeForTable(transaction.transactionDate) || 'Unknown'}</TableCell>
                        <TableCell className="font-medium text-primary-foreground">{transaction.salesOrderId || 0}</TableCell>
                        <TableCell className="text-primary-foreground">
                            {transaction.productList?.length > 0 
                                ? transaction.productList.map(product => product.productName).join(', ')
                                : 'No products'
                            }
                        </TableCell>
                        <TableCell className="text-center text-primary-foreground">{transaction.processedBy}</TableCell>
                        <TableCell className="text-center text-primary-foreground">{transaction.paymentMethod}</TableCell>
                        <TableCell className="text-center text-primary-foreground">{transaction.discountName}</TableCell>
                        <TableCell className="text-center text-primary-foreground"><span className="text-custom-green">+ ₱ {transaction.amount}</span></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {transactions.length > 0 && !asyncState.isLoading && (
                <PaginationBar
                    pageCount={filter.pageCount}
                    pageSize={filter.pageSize}
                    totalPages={pagination.totalPages}
                    totalEntries={pagination.totalEntries}
                    updateFilter={updateFilter}
                />
            )}
        </div>
    ); 
}

export default TransactionsTable;