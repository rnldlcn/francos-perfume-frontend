import { useTransaction } from '@/hooks/transaction_hooks/useTransaction';
import { Search } from 'lucide-react';
import { useState } from 'react';
import ExportTransactionModal from "../../components/features/transactions_components/ExportTransactionModal";
import TransactionsTable from '../../components/features/transactions_components/TransactionsTable';

export default function TransactionsPage() {
    const { transactions, filter, isLoading, totalPages, totalEntries, fetchTransactions, updateFilter } = useTransaction();

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
                    <h1 className="text-[32px] font-bold text-gray-800 leading-none mb-2">Transaction History</h1>
                    <p className="text-gray-500 text-sm">View all POS sales.</p>
                </div>
                <button 
                    onClick={fetchTransactions}
                    className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
                >
                    🔄 Refresh Status
                </button>
            </div>

            <div className="relative w-full md:w-96 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>`

            <TransactionsTable
                transactions={transactions}
                filter={filter}
                isLoading={isLoading}
                updateFilter={updateFilter}
                totalEntries={totalEntries}
                totalPages={totalPages}
            />

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">
                <button 
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm">
                    📊 Export
                </button>
            </div>
            <ExportTransactionModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </div>
    );
}