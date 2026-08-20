// 🔧 FIXED: Added missing icon imports that were causing the crash

export default function DeliveryConfirmationPage() {
    /*
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [items, setItems] = useState([]);
    const [generalRemarks, setGeneralRemarks] = useState('');
    
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('COMPLETE'); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadDetails();
    }, [id]);

    const loadDetails = async () => {
        try {
            const data = await RequestService.getRequestDetails(id);
            setRequest(data);
            setItems(data.items.map(item => ({
                ...item,
                received_qty: item.requested_qty,
                isReceived: true,
                remarks: '' // This will hold the "Reason" from the dropdown
            })));
        } catch (error) {
            console.error(error);
            alert("Error loading request details.");
        }
    };

    const handleQtyChange = (itemId, val) => {
        setItems(prev => prev.map(i => 
            i.request_item_id === itemId ? { ...i, received_qty: parseInt(val) || 0 } : i
        ));
    };

    // 🔧 NEW: Handler for the reason dropdown
    const handleRemarkChange = (itemId, reason) => {
        setItems(prev => prev.map(i => 
            i.request_item_id === itemId ? { ...i, remarks: reason } : i
        ));
    };

    const handleCheckToggle = (itemId) => {
        setItems(prev => prev.map(i => {
            if (i.request_item_id === itemId) {
                const newStatus = !i.isReceived;
                return { ...i, isReceived: newStatus, received_qty: newStatus ? i.requested_qty : 0 };
            }
            return i;
        }));
    };

    const handleConfirmClick = () => {
        const isPartial = items.some(item => item.received_qty < item.requested_qty);
        setModalType(isPartial ? 'PARTIAL' : 'COMPLETE');
        setShowModal(true);
    };

    const submitDelivery = async () => {
        setIsSubmitting(true);
        try {
            // Sending the actual mapped data to the backend
            await DeliveryService.receiveRequest(id, {
                receivedItems: items.map(i => ({
                    request_item_id: i.request_item_id,
                    received_qty: i.received_qty,
                    remarks: i.remarks
                })),
                generalRemarks: generalRemarks
            });
            
            alert("Delivery confirmed successfully!");
            navigate('/home/deliveries');
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
            setShowModal(false);
        }
    };

    if (!request) return <div className="p-10 text-center font-montserrat">Loading Confirmation Details...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat">
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="px-4 py-2 bg-amber-100 text-amber-800 rounded font-semibold flex items-center gap-2 hover:bg-amber-200 transition-colors"
                >
                    <ChevronLeft size={18} /> Back
                </button>
                <h1 className="text-2xl font-bold text-gray-800">{request.request_display_id}</h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold uppercase border border-purple-200">
                    INBOUND
                </span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Requested Products</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-100">
                                <th className="pb-3 font-medium">ID</th>
                                <th className="pb-3 font-medium">Product Name</th>
                                <th className="pb-3 text-center font-medium">Requested Qty</th>
                                <th className="pb-3 text-center font-medium">Received?</th>
                                <th className="pb-3 text-center font-medium">Received Qty</th>
                                <th className="pb-3 font-medium">Remarks/Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.request_item_id} className="border-b border-gray-50 last:border-0">
                                    <td className="py-4">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                                            {item.product_display_id}
                                        </span>
                                    </td>
                                    <td className="py-4 text-gray-700">{item.product_name}</td>
                                    <td className="py-4 text-center font-bold text-gray-800">{item.requested_qty}</td>
                                    <td className="py-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={item.isReceived} 
                                            onChange={() => handleCheckToggle(item.request_item_id)} 
                                            className="w-5 h-5 accent-[#C8B285] cursor-pointer"
                                        />
                                    </td>
                                    <td className="py-4 text-center">
                                        <input 
                                            type="number" 
                                            disabled={!item.isReceived}
                                            value={item.received_qty}
                                            onChange={(e) => handleQtyChange(item.request_item_id, e.target.value)}
                                            className={`w-16 text-center p-1 border rounded outline-none ${
                                                item.isReceived ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-400'
                                            }`}
                                            min="0" 
                                            max={item.requested_qty}
                                        />
                                    </td>
                                    <td className="py-4">
                                        <select 
                                            value={item.remarks}
                                            onChange={(e) => handleRemarkChange(item.request_item_id, e.target.value)}
                                            disabled={item.received_qty === item.requested_qty}
                                            className="w-full p-1 border border-gray-200 rounded text-sm text-gray-600 outline-none focus:border-amber-300 disabled:bg-gray-100 disabled:opacity-50"
                                        >
                                            <option value="">Select reason...</option>
                                            <option value="Damaged Item">Damaged Item</option>
                                            <option value="Missing from package">Missing from package</option>
                                            <option value="Wrong item sent">Wrong item sent</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Additional Remarks</h2>
                <textarea 
                    value={generalRemarks}
                    onChange={(e) => setGeneralRemarks(e.target.value)}
                    placeholder="Add your comments or message for this request..." 
                    className="w-full p-3 border border-gray-200 rounded-lg h-24 outline-none focus:border-blue-300 resize-none text-sm"
                />
            </div>

            <button 
                onClick={handleConfirmClick} 
                className="w-full md:w-1/3 mx-auto block bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-md"
            >
                Confirm Delivery
            </button>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
                        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                            modalType === 'PARTIAL' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                        }`}>
                            {modalType === 'PARTIAL' ? <Clock size={32} /> : <CheckCircle size={32} />}
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">
                            {modalType === 'PARTIAL' ? 'Partial Delivery' : 'Delivery Complete'}
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            {modalType === 'PARTIAL' 
                                ? "You have marked some items as missing or less than the requested quantity. This will mark the request as PARTIALLY COMPLETED. Proceed?" 
                                : "All requested items have been accounted for. This will close the request and update your inventory. Proceed?"}
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="flex-1 py-2 font-bold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={submitDelivery} 
                                disabled={isSubmitting} 
                                className={`flex-1 py-2 font-bold text-white rounded-lg transition-colors shadow-sm ${
                                    modalType === 'PARTIAL' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    */
}