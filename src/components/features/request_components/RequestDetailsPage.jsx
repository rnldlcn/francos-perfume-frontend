import { useParams } from "react-router-dom";

export default function RequestDetailsPage({onClose}) {
    const { requestId } = useParams();

    console.log(requestId);
    /*
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuth(); 

    // --- STATE ---
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Line item state for checkboxes and quantities
    const [lineItems, setLineItems] = useState([]);

    // Modal States
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);

    // --- FETCH DATA ---
    useEffect(() => {
        loadRequestDetails();
    }, [id]);

    const loadRequestDetails = async () => {
        setLoading(true);
        try {
            const data = await RequestService.getRequestDetails(id);
            setRequest(data);
            
            setLineItems(data.items.map(item => ({
                ...item,
                // 🔧 FIXED: Defaults to false so the user is forced to review and check them manually
                isApproved: false, 
                approved_qty: item.requested_qty 
            })));

        } catch (error) {
            console.error("Failed to fetch request details:", error);
            alert("Could not load request details. Please try again.");
            navigate('/home/requests');
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS ---
    const handleLineItemToggle = (itemId, checked) => {
        setLineItems(prev => prev.map(item => {
            if (item.request_item_id === itemId) {
                return { ...item, isApproved: checked, approved_qty: checked ? item.requested_qty : 0 };
            }
            return item;
        }));
    };

    const handleLineItemQtyChange = (itemId, newQty) => {
        setLineItems(prev => prev.map(item => 
            item.request_item_id === itemId ? { ...item, approved_qty: parseInt(newQty) || 0 } : item
        ));
    };

    const handleAction = async (action) => {
        setIsSubmitting(true);
        setShowApproveModal(false);
        try {
            if (action === 'APPROVE') {
                // Note: If your API supports it, you should also pass the modified lineItems here
                await RequestService.approveRequest(id, remarks || "Approved via Dashboard");
            } else {
                if (!remarks) {
                    alert("Remarks are required to reject a request.");
                    setIsSubmitting(false);
                    return;
                }
                await RequestService.rejectRequest(id, remarks);
            }
            
            alert(`Request ${action}D successfully!`);
            navigate('/home/requests'); 
            
        } catch (error) {
            console.error(error);
            alert(`Failed to ${action} request: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelRequest = async () => {
        setIsSubmitting(true);
        setShowCancelModal(false);
        try {
            if(RequestService.cancelRequest) {
                await RequestService.cancelRequest(id);
            } else {
                await RequestService.rejectRequest(id, "Cancelled by Requesting Branch");
            }
            alert("Request CANCELLED successfully!");
            navigate('/home/requests');
        } catch (error) {
            console.error(error);
            alert(`Failed to cancel request: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- DERIVED STATE ---
    if (loading || !request) return <div className="p-10 text-center text-gray-500 font-montserrat">Loading Request Details...</div>;

    // 🔧 WAREHOUSE LOGIC: Determine if the Owner/Warehouse created this push request
    const isWarehousePush = request.requested_from === 'WAREHOUSE' || request.from_branch_name === 'WAREHOUSE';

    const totalProducts = lineItems.length;
    const totalRequestedUnits = lineItems.reduce((sum, item) => sum + item.requested_qty, 0);
    const totalApprovedUnits = lineItems.reduce((sum, item) => sum + item.approved_qty, 0);

    // 🔧 VALIDATION: Ensure ALL products are explicitly checked AND have a valid quantity
    const allProductsApproved = lineItems.length > 0 && lineItems.every(item => item.isApproved && item.approved_qty > 0);

    // --- SECURITY LOGIC: Determine if buttons should show ---
    const activeApproval = request.approvals.find(a => a.status === 'PENDING');
    let canApprove = false;
    const userBranchId = parseInt(sessionStorage.getItem('branchId')); 

    if (activeApproval && user) {
        const role = user.activeRole.toUpperCase();
        
        if (activeApproval.stage === 'OWNER' && role === 'OWNER') {
            canApprove = true;
        } 
        else if (role === 'MANAGER') {
            if (activeApproval.stage === 'REQUESTING_MANAGER' && userBranchId === request.to_branch_id) {
                canApprove = true;
            } 
            else if (activeApproval.stage === 'FULFILLING_MANAGER' && userBranchId === request.from_branch_id) {
                canApprove = true;
            }
        }
    }

    const isReceivingBranch = userBranchId === request.to_branch_id;
    const isPastDispatch = request.request_status === 'IN TRANSIT' || request.request_status === 'COMPLETED' || request.request_status === 'DISPATCHED';
    const isAlreadyClosed = request.request_status === 'REJECTED' || request.request_status === 'CANCELLED';
    
    const canCancel = isReceivingBranch && !isPastDispatch && !isAlreadyClosed;

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-montserrat relative">
            
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-amber-100 text-amber-800 rounded font-semibold hover:bg-amber-200 transition-colors"
                    >
                        &lt; Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">{request.request_display_id}</h1>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold border border-blue-200">
                        {request.request_status}
                    </span>
                </div>

                {canCancel && (
                    <button 
                        onClick={() => setShowCancelModal(true)}
                        className="px-4 py-2 bg-red-700 text-white rounded font-bold hover:bg-red-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <X size={18} /> Cancel Request
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-6">
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Request Information</h2>
                        <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
                            <div>
                                <p className="text-gray-400 mb-1">From Branch</p>
                                <p className="font-semibold">{request.requested_from || request.from_branch_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">To Branch</p>
                                <p className="font-semibold">{request.delivered_to || request.to_branch_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Created By</p>
                                <p className="font-semibold">{request.employee_display_id}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Date Created</p>
                                <p className="font-semibold">{new Date(request.request_date_submitted).toLocaleString()}</p>
                            </div>
                        </div>

                        {request.request_message && (
                            <div className="bg-[#EAEBFA] p-4 rounded-lg flex gap-3">
                                <div className="text-[#5B63D3] mt-1"><Clock size={20} /></div>
                                <div>
                                    <p className="text-sm font-bold text-[#5B63D3] mb-1">Request Message</p>
                                    <p className="text-sm text-[#5B63D3]/80 whitespace-pre-wrap">{request.request_message}</p>
                                </div>
                            </div>
                        )}
                        
                        {request.request_comment && (
                            <div className="bg-red-50 p-4 rounded-lg flex gap-3 mt-3 border border-red-100">
                                <div className="text-red-500 mt-1"><X size={20} /></div>
                                <div>
                                    <p className="text-sm font-bold text-red-700 mb-1">Rejection Remarks</p>
                                    <p className="text-sm text-red-600 whitespace-pre-wrap">{request.request_comment}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            {isWarehousePush ? "Products to be Sent" : "Requested Products"}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-400 border-b border-gray-100">
                                        <th className="pb-3 font-medium">ID</th>
                                        <th className="pb-3 font-medium">Product Name</th>
                                        <th className="pb-3 font-medium text-center">Available</th>
                                        <th className="pb-3 font-medium text-center">Requested</th>
                                        <th className="pb-3 font-medium text-center">Approve?</th>
                                        <th className="pb-3 font-medium text-center">Approved Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lineItems.map(item => (
                                        <tr key={item.request_item_id} className="border-b border-gray-50 last:border-0">
                                            <td className="py-4">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                                                    {item.product_display_id}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-700 font-medium">{item.product_name}</td>
                                            <td className="py-4 text-center text-gray-500">{item.available_qty || 50}</td>
                                            <td className="py-4 text-center font-bold text-gray-800">{item.requested_qty}</td>
                                            
                                            <td className="py-4 text-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-5 h-5 accent-[#5A9B5C] cursor-pointer rounded border-gray-300 mx-auto block"
                                                    checked={item.isApproved}
                                                    disabled={!canApprove}
                                                    onChange={(e) => handleLineItemToggle(item.request_item_id, e.target.checked)}
                                                />
                                            </td>

                                            <td className="py-4 text-center">
                                                <input 
                                                    type="number" 
                                                    disabled={!item.isApproved || !canApprove}
                                                    value={item.approved_qty}
                                                    onChange={(e) => handleLineItemQtyChange(item.request_item_id, e.target.value)}
                                                    className={`w-20 text-center p-1.5 border rounded-md outline-none mx-auto block font-medium transition-colors ${
                                                        item.isApproved ? 'bg-[#F4FBF4] border-[#5A9B5C] text-green-800' : 'bg-gray-50 border-gray-200 text-gray-400'
                                                    } ${!canApprove && 'opacity-50 cursor-not-allowed'}`}
                                                    min="0"
                                                    max={item.requested_qty}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold mb-6 text-gray-800">Approval Timeline</h2>
                        <div className="relative border-l-2 border-dashed border-gray-200 ml-3 space-y-8">
                            

                            {request.approvals
                                .filter(approval => !(isWarehousePush && approval.stage === 'FULFILLING_MANAGER'))
                                .map((approval, index) => {
                                    
                                    // 🔧 FIXED: Rename the stage to "Receiving Manager" for warehouse pushes
                                    let stageName = approval.stage.toLowerCase().replace('_', ' ');
                                    if (isWarehousePush && approval.stage === 'REQUESTING_MANAGER') {
                                        stageName = 'receiving manager';
                                    }

                                    return (
                                        <div key={index} className="relative pl-6">
                                            <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                                                approval.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 
                                                approval.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                approval.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                <Clock size={12} />
                                            </div>
                                            
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-800 capitalize">
                                                        {stageName} Review
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {approval.status === 'APPROVED' ? `Approved by ${approval.approver || 'System'}` : 
                                                         approval.status === 'REJECTED' ? `Rejected by ${approval.approver || 'System'}` : 
                                                         'Waiting for approval'}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                                    approval.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                                    approval.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                                                    'bg-yellow-50 text-yellow-600 border border-yellow-200'
                                                }`}>
                                                    {approval.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                            })}

                            <div className="relative pl-6">
                                <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                                    (request.request_status === 'IN TRANSIT' || request.request_status === 'COMPLETED') 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                    {(request.request_status === 'IN TRANSIT' || request.request_status === 'COMPLETED') ? <Check size={12} /> : <Clock size={12} />}
                                </div>
                                
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">For Dispatch</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {(request.request_status === 'IN TRANSIT' || request.request_status === 'COMPLETED') 
                                                ? 'Dispatched and on the way' 
                                                : 'Waiting for dispatch'}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                        (request.request_status === 'IN TRANSIT' || request.request_status === 'COMPLETED') 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                                    }`}>
                                        {(request.request_status === 'IN TRANSIT' || request.request_status === 'COMPLETED') ? 'DISPATCHED' : 'PENDING'}
                                    </span>
                                </div>
                            </div>

                            <div className="relative pl-6">
                                <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                                    request.request_status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                    {request.request_status === 'COMPLETED' ? <Check size={12} /> : <Clock size={12} />}
                                </div>
                                
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">Stock Received</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {request.request_status === 'COMPLETED' ? 'Delivery acknowledged' : 'Waiting to be received'}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                        request.request_status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                                    }`}>
                                        {request.request_status === 'COMPLETED' ? 'COMPLETED' : 'PENDING'}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Products:</span>
                                <span className="font-bold text-gray-800">{totalProducts}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Total Units:</span>
                                <span className="font-bold text-gray-800">{totalRequestedUnits}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-gray-100">
                                <span className="text-green-600 font-semibold">Approved Units:</span>
                                <span className="font-bold text-green-600">{totalApprovedUnits}</span>
                            </div>
                        </div>
                    </div>

                    {canApprove && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-300">
                            <h2 className="text-lg font-bold mb-2 text-gray-800">Required Action</h2>
                            <p className="text-xs text-gray-500 mb-4">You are authorized to review this stage.</p>
                            
                            <textarea 
                                placeholder="Add remarks (required for rejection)..." 
                                className="w-full p-3 border border-gray-200 rounded-lg mb-4 text-sm outline-none focus:border-blue-300 resize-none h-20"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />

                            <div className="space-y-3">
                                {allProductsApproved && (
                                    <button 
                                        onClick={() => setShowApproveModal(true)}
                                        disabled={isSubmitting}
                                        className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200 hover:bg-green-100 transition-colors flex justify-center items-center gap-2"
                                    >
                                        <Check size={18} /> Approve Request
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleAction('REJECT')}
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-red-50 text-red-700 font-bold rounded-lg border border-red-200 hover:bg-red-100 transition-colors flex justify-center items-center gap-2"
                                >
                                    <X size={18} /> Reject Request
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
                            <AlertTriangle className="text-red-600" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Cancel Transfer Request?</h2>
                        <p className="text-center text-gray-600 mb-6">
                            Are you sure you want to cancel <strong>{request?.request_display_id}</strong>? This action cannot be undone and will terminate the request entirely.
                        </p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowCancelModal(false)}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-md hover:bg-gray-200 transition-colors"
                            >
                                No, Keep It
                            </button>
                            <button 
                                onClick={handleCancelRequest}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors"
                            >
                                {isSubmitting ? "Cancelling..." : "Yes, Cancel Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showApproveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4 mx-auto">
                            <Check className="text-green-600" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Confirm Approval</h2>
                        <p className="text-center text-gray-600 mb-6">
                            You have checked all products for <strong>{request?.request_display_id}</strong>. Are you sure you want to officially approve this stage of the request?
                        </p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowApproveModal(false)}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleAction('APPROVE')}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors"
                            >
                                {isSubmitting ? "Approving..." : "Yes, Approve"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
    */
}