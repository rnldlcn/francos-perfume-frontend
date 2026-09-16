import { CheckCircle, Eye, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/shared/StatusBadge'; // 🔧 NEW: Imported the StatusBadge component
import { DeliveryService } from '../../services/deliveryService';

export default function DeliveriesPage() {
    const navigate = useNavigate();
    const userBranchId = parseInt(sessionStorage.getItem('branchId'));
    
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('DISPATCH'); 

    useEffect(() => {
        loadDeliveries();
    }, []);
    const loadDeliveries = async () => {
        setLoading(true);
        try {
            const response = await DeliveryService.getAllDeliveries();
            setRequests(response.data || []);
        } catch (error) {
            console.error("Failed to load deliveries", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDispatch = async (requestId) => {
        try {
            await DeliveryService.dispatchRequest(requestId);
            alert("Request marked as In Transit!");
            loadDeliveries(); 
        } catch (error) {
            alert(error.message);
        }
    };

    // --- UPDATED FILTER LOGIC ---
    
    // 1. FOR DISPATCH: Actionable to-do list for the SENDING branch only.
    const forDispatch = requests.filter(r => 
        r.request_status === 'FOR DISPATCH' && r.from_branch_id === userBranchId
    );
    
    // 2. OUTBOUND: All requests leaving this branch (Approved, In Transit, or Completed).
    const outboundDeliveries = requests.filter(r => 
        r.from_branch_id === userBranchId && r.request_status !== 'REJECTED'
    );

    // 3. INBOUND: All requests coming to this branch (Approved, In Transit, or Completed).
    const inboundDeliveries = requests.filter(r => 
        r.to_branch_id === userBranchId && r.request_status !== 'REJECTED'
    );

    const getDisplayList = () => {
        if (activeTab === 'DISPATCH') return forDispatch;
        if (activeTab === 'OUTBOUND') return outboundDeliveries;
        return inboundDeliveries;
    };

    if (loading) return <div className="p-10 text-center font-montserrat">Loading Deliveries...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Deliveries</h1>
            <p className="text-gray-500 mb-8">Manage stock movement between branches</p>

            {/* TABS */}
            <div className="flex gap-2 mb-6">
                <button onClick={() => setActiveTab('DISPATCH')} className={`flex-1 py-3 font-semibold rounded transition ${activeTab === 'DISPATCH' ? 'bg-[#E5D7B7] text-gray-800 border-b-4 border-[#C8B285]' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                    For Dispatch ({forDispatch.length})
                </button>
                <button onClick={() => setActiveTab('OUTBOUND')} className={`flex-1 py-3 font-semibold rounded transition ${activeTab === 'OUTBOUND' ? 'bg-[#E5D7B7] text-gray-800 border-b-4 border-[#C8B285]' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                    Outbound Deliveries ({outboundDeliveries.length})
                </button>
                <button onClick={() => setActiveTab('INBOUND')} className={`flex-1 py-3 font-semibold rounded transition ${activeTab === 'INBOUND' ? 'bg-[#E5D7B7] text-gray-800 border-b-4 border-[#C8B285]' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                    Inbound Deliveries ({inboundDeliveries.length})
                </button>
            </div>

            {/* LIST */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm">
                {getDisplayList().length === 0 && <p className="text-center text-gray-500 py-10">No deliveries found in this category.</p>}
                
                {getDisplayList().map(req => (
                    <div key={req.request_id} className="border border-gray-200 rounded-lg p-5 bg-white hover:border-amber-200 transition-colors">
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-100 rounded-full text-gray-600">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-xl text-gray-800">{req.request_display_id}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${req.from_branch_id === userBranchId ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {req.from_branch_id === userBranchId ? 'Outbound' : 'Inbound'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">From <span className="font-semibold text-gray-700">{req.requested_from}</span> To <span className="font-semibold text-gray-700">{req.delivered_to}</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-800 mb-1">{req.item_count} Products</p>
                                {/* 🔧 FIXED: Replaced messy Tailwind logic with the clean StatusBadge */}
                                <StatusBadge status={req.request_status} />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {/* ACTION: SENDER MARKS AS IN TRANSIT */}
                            {req.request_status === 'FOR DISPATCH' && req.from_branch_id === userBranchId && (
                                <button onClick={() => handleDispatch(req.request_id)} className="flex-[2] bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg flex justify-center items-center gap-2 font-bold transition shadow-sm">
                                    <CheckCircle size={18} /> Mark as In Transit
                                </button>
                            )}

                            {/* ACTION: RECEIVER MARKS AS ARRIVED */}
                            {req.request_status === 'IN TRANSIT' && req.to_branch_id === userBranchId && (
                                <button 
                                    onClick={() => navigate(`/home/deliveries/confirm/${req.request_id}`)} 
                                    className="flex-[2] bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex justify-center items-center gap-2 font-bold transition shadow-sm"
                                >
                                    <CheckCircle size={18} /> Delivery Arrived
                                </button>
                            )}

                            <button 
                                onClick={() => navigate(`/home/requests/${req.request_id}`)} 
                                className="flex-1 bg-[#EAE2D0] hover:bg-[#DCD0B3] text-gray-800 py-3 rounded-lg flex justify-center items-center gap-2 font-bold transition"
                            >
                                <Eye size={18} /> View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}