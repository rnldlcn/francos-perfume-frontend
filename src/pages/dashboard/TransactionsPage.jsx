import { transactionColumns } from '@/components/features/transactions_components/TransactionColumns';
import { SearchBar } from '@/components/shared';
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { useTransaction } from '@/hooks/transaction_hooks/useTransaction';
import { FileDown, RefreshCcw, Loader2 } from 'lucide-react'; // ADDED: Loader2
import { useState } from 'react';
import ExportTransactionModal from "../../components/features/transactions_components/ExportTransactionModal";

export default function TransactionsPage() {
    const { 
        transactions,
        asyncState, 
        pagination, 
        filter, 
        fetchTransactions, 
        updateFilter,
    } = useTransaction();

    const [searchQuery, setSearchQuery] = useState('');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const handleSearchChange = (value) => {
        const query = value?.target ? value.target.value : value;
        setSearchQuery(query);
        updateFilter('search', query);
    }

    return (
        // FIXED: Replaced bg-gray-50 with bg-background and removed p-6 if it conflicts with global layout, but kept standard spacing
        <div className="bg-background min-h-screen font-montserrat flex flex-col animate-fade-in relative">
            
            <div className="flex justify-between items-start mb-6">
                <div>
                    {/* FIXED: Replaced text-custom-black with text-foreground */}
                    <h1 className="text-[32px] font-bold text-foreground leading-none mb-2">Transaction History</h1>
                    {/* FIXED: Replaced text-custom-gray with text-muted-foreground */}
                    <p className="text-muted-foreground text-sm">View all POS sales.</p>
                </div>
            </div>

            {/* add filter and search here */}
            {/* FIXED: Added mb-6 so the search bar isn't glued to the table */}
            <div className="relative w-full md:w-96 shrink-0 mb-6">

                <SearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                />


            </div>

            {/* ADDED: Initial loading animation guard for when transactions are first being fetched */}
            {asyncState?.isLoading && (!transactions || transactions.length === 0) ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fade-in">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground font-medium">Loading transactions...</p>
                </div>
            ) : (
                <DataTable
                    columns={transactionColumns}
                    data={transactions}
                    keyField="salesOrderId"
                    asyncState={asyncState}
                    pagination={pagination}
                    filter={filter}
                    updateFilter={updateFilter}
                />
            )}

            <div className="relative flex justify-between gap-6 mt-4">
                <Button
                    onClick={() => setIsExportModalOpen(true)}
                    >
                    <FileDown className='h-8 w-8'/>
                    Export
                </Button>

                <Button
                    onClick={fetchTransactions}
                    className='justify-end'
                >
                    <RefreshCcw className='w-4 h-4'/>
                    Refresh Status
                </Button>
            </div>
            <ExportTransactionModal 
                isOpen={isExportModalOpen} 
                onClose={() => setIsExportModalOpen(false)}
            />

        </div>
    );
}