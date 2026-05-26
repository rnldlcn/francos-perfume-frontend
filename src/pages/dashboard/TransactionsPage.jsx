import { ArrowRightLeft, Calendar, Receipt, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import ExportTransactionModal from "../../components/features/transactions_components/ExportTransactionModal";
import { UseAuth } from '../../services/AuthService';

export default function TransactionsPage() {
    const { user } = UseAuth();
    const userBranchId = parseInt(sessionStorage.getItem('branchId'));
    const isManager = user?.activeRole?.toUpperCase() === 'MANAGER';

    // --- STATE ---
    const [activeTab, setActiveTab] = useState('SALES'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const [sales, setSales] = useState([]);
    const [transfers, setTransfers] = useState([]); // Empty until C# endpoint is built

    // --- PAGINATION ---
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20; // 🔧 Updated to 20 items per page

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

    // --- FETCH DATA ---
    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            // 🔧 pageSize set to 999999 to guarantee ALL transactions are fetched from the database
            const response = await fetch(`http://localhost:5000/api/Transaction/displayTransactions?page=1&pageSize=999999`, {
                headers: { 'Authorization': `Bearer ${user?.accessToken}` }
            });

            if (response.ok) {
                const json = await response.json();
                const rawData = json.data || json;

                const formattedSales = rawData.map(s => {
                    const itemsDetail = s.product_list && s.product_list.length > 0 
                        ? s.product_list.map(i => `${i.qty}x ${i.product_name}`).join(', ')
                        : 'Unknown items';

                    return {
                        id: s.sales_order_id,
                        details: `Sale: ${itemsDetail}`,
                        processedBy: s.processed_by || 'Unknown Staff',
                        amount: s.amount || 0,
                        type: 'Sale',
                        rawDate: new Date(s.transaction_date),
                        date: new Date(s.transaction_date).toLocaleDateString('en-CA'),
                        time: new Date(s.transaction_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        branch_name: 'Current Branch', 
                        payment_method: 'N/A' 
                    };
                });

                setSales(formattedSales);
            }
        } catch (error) {
            console.error("Failed to fetch transaction history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user?.accessToken]);

    // --- FILTER LOGIC ---
    const filteredSales = sales.filter(s => {
        const query = searchQuery.toLowerCase();
        const searchMatch = (s.id || '').toLowerCase().includes(query) ||
                            (s.details || '').toLowerCase().includes(query) ||
                            (s.processedBy || '').toLowerCase().includes(query);
        return searchMatch;
    });

    const filteredTransfers = transfers.filter(t => {
        const query = searchQuery.toLowerCase();
        const searchMatch = (t.id || '').toLowerCase().includes(query);
        return searchMatch;
    });

    const currentData = activeTab === 'SALES' ? filteredSales : filteredTransfers;
    const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
    const displayData = currentData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat flex flex-col">
            
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-[32px] font-bold text-gray-800 leading-none mb-2">Transaction History</h1>
                    <p className="text-gray-500 text-sm">View all POS sales and stock transfer logs.</p>
                </div>
                <button 
                    onClick={fetchHistory}
                    className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
                >
                    🔄 Refresh Status
                </button>
            </div>

            {/* Top Bar: Tabs & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                
                {/* TABS */}
                <div className="flex gap-2 w-full md:w-auto bg-gray-200 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('SALES')} 
                        className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm rounded transition-colors ${activeTab === 'SALES' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Receipt size={16} /> POS Sales
                    </button>
                    <button 
                        onClick={() => setActiveTab('TRANSFERS')} 
                        className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm rounded transition-colors ${activeTab === 'TRANSFERS' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ArrowRightLeft size={16} /> Stock Transfers
                    </button>
                </div>

                {/* SEARCH */}
                <div className="relative w-full md:w-96 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={`Search ${activeTab === 'SALES' ? 'receipts or staff...' : 'transfer IDs...'}`} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-[12px] text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date & Time</th>
                                <th className="px-6 py-4 font-semibold">{activeTab === 'SALES' ? 'Receipt No.' : 'Transfer ID'}</th>
                                {activeTab === 'SALES' ? (
                                    <>
                                        <th className="px-6 py-4 font-semibold">Products Sold</th>
                                        <th className="px-6 py-4 font-semibold">Processed By</th>
                                        <th className="px-6 py-4 font-semibold">Payment</th>
                                        <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-4 font-semibold">Route</th>
                                        <th className="px-6 py-4 font-semibold">Items Restocked</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                                        Loading history...
                                    </td>
                                </tr>
                            ) : displayData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">
                                        No {activeTab === 'SALES' ? 'sales' : 'transfers'} found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                displayData.map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        
                                        {/* DATE */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {item.date} <span className="text-xs text-gray-400">({item.time})</span>
                                            </div>
                                        </td>

                                        {/* ID */}
                                        <td className="px-6 py-4 font-bold text-gray-800">{item.id}</td>

                                        {/* DYNAMIC COLUMNS */}
                                        {activeTab === 'SALES' ? (
                                            <>
                                                <td className="px-6 py-4 font-medium text-gray-700 max-w-xs truncate" title={item.details}>{item.details}</td>
                                                <td className="px-6 py-4 text-gray-600">{item.processedBy}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-gray-100 text-gray-600">
                                                        {item.payment_method}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-[#94BE9F]">
                                                    + ₱{Number(item.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4">N/A</td>
                                                <td className="px-6 py-4 font-medium">N/A</td>
                                                <td className="px-6 py-4">N/A</td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {displayData.length > 0 && (
                    <div className="flex justify-between items-center mt-auto p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">
                        <p>Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, currentData.length)} of {currentData.length} entries</p>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-white border border-gray-200 rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                Prev
                            </button>
                            <span className="font-semibold text-gray-700">{currentPage} / {totalPages || 1}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 py-1 bg-white border border-gray-200 rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">
                <button 
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm"
                >
                    📊 Export
                </button>
            </div>

            <ExportTransactionModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </div>
    );
}