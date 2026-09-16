
import DataTable from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { useTransaction } from '@/hooks/transaction_hooks/useTransaction';
import { transactionColumns } from '@/utils/columns';
import { FileDown, RefreshCcw, Search } from 'lucide-react';
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
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat flex flex-col">
            
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-[32px] font-bold text-custom-black leading-none mb-2">Transaction History</h1>
                    <p className="text-custom-gray text-sm">View all POS sales.</p>
                </div>
            </div>

            {/* add filter and search here */}
            <div className="relative w-full md:w-96 shrink-0">

                <Search className="relative left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    value={searchQuery}
                    onChange={handleSearchChange}
                />


            </div>

            <DataTable
                columns={transactionColumns}
                data={transactions}
                keyField="salesOrderId"
                asyncState={asyncState}
                pagination={pagination}
                filter={filter}
                updateFilter={updateFilter}
            />

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