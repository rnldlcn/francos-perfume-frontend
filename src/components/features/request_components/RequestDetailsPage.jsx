import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/request_hooks/useRequest";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequestInformation from "./RequestInformation";
import RequestTimeline from "./RequestTimeline";
import { requestedProductsColumns } from "./RequestedProductsColumns";

export default function RequestDetailsPage() {
    const { 
        fetchRequestDetails 
    } = useRequest();

    const { requestId } = useParams();
    const navigate = useNavigate();

    const [requestDetails, setRequestDetails] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [showApproveModal, setShowApproveModal] = useState(false);
    
    // Track row modifications for approval inputs
    const [itemApprovals, setItemApprovals] = useState({});

    useEffect(() => {
        if (requestId) {
            fetchRequestDetails(requestId).then((data) => {
                if (data) {
                    setRequestDetails(data);
                    // Initialize approval quantities to match requested quantities
                    const initialApprovals = {};
                    (data.items || []).forEach((item) => {
                        initialApprovals[item.requestItemId] = {
                            isApproved: true,
                            approvedQty: item.requestedQty,
                        };
                    });
                    setItemApprovals(initialApprovals);
                }
            });
        }
    }, [requestId, fetchRequestDetails]);

    // Handle Checkbox / Quantity state updates
    const handleApproveToggle = (requestItemId, isApproved) => {
        setItemApprovals((prev) => ({
            ...prev,
            [requestItemId]: { ...prev[requestItemId], isApproved },
        }));
    };

    const handleQtyChange = (requestItemId, approvedQty) => {
        setItemApprovals((prev) => ({
            ...prev,
            [requestItemId]: { ...prev[requestItemId], approvedQty: Number(approvedQty) },
        }));
    };

    /*
    const totalProducts = requestDetails?.items?.length || 0;
    const totalRequestedUnits = useMemo(() => {
        return requestDetails?.items?.reduce((acc, curr) => acc + (curr.requestedQty || 0), 0) || 0;
    }, [requestDetails]);

    const totalApprovedUnits = useMemo(() => {
        return Object.values(itemApprovals).reduce((acc, curr) => {
            return acc + (curr.isApproved ? Number(curr.approvedQty || 0) : 0);
        }, 0);
    }, [itemApprovals]);
    */

    const isWarehousePush = requestDetails?.requestedFrom === "WAREHOUSE";
    const canApprove = requestDetails?.requestStatus === "PENDING";
    //const allProductsApproved = Object.values(itemApprovals).some((item) => item.isApproved);

    const handleRejectRequest = async (requestId) => {
        // add reject endpoint here
    }
    
    const handleConfirmRequest = async (requestId) => {
        // add confirm endpoint here
    }

    const handleCancelRequest = async (requestId) => {
        // add cancel endpoint here
    }

    if (!requestDetails) {
        return <div className="p-6 text-gray-500 font-montserrat">Loading request details...</div>;
    }

    return (
        <div className="p-6 min-h-screen font-montserrat">
            {/* Header / Navigation */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/home/requests")}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <h1 className="text-2xl font-bold text-custom-black">
                        {requestDetails.requestDisplayId}
                    </h1>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase">
                        {requestDetails.requestStatus}
                    </span>
                </div>

                {canApprove && (
                    <Button 
                        variant="destructive" 
                        onClick={() => handleCancelRequest(requestId)}
                    >
                        Cancel Request
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <RequestInformation 
                        request={requestDetails} 
                    />

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Requested Products</h2>
                        <DataTable
                            columns={requestedProductsColumns(
                                itemApprovals, 
                                handleApproveToggle, 
                                handleQtyChange
                            )}
                            data={requestDetails.items || []}
                            keyField="requestItemId"
                            showPagination={false}
                            showSearch={false}
                        />
                    </div>
                </div>

                {/* Right Side: Timeline & Summary Sidebar */}
                <div>
                    <RequestTimeline
                        selectedRequest={requestDetails}
                        isWarehousePush={isWarehousePush}
                        canApprove={canApprove}
                        remarks={remarks}
                        setRemarks={setRemarks}
                        //isSubmitting={isSubmitting}
                        setShowApproveModal={setShowApproveModal}
                        //allProductsApproved={allProductsApproved}
                        //handleAction={handleAction}
                        //totalProducts={totalProducts}
                        //totalRequestedUnits={totalRequestedUnits}
                        //totalApprovedUnits={totalApprovedUnits}
                    />
                </div>
            </div>
        </div>
    );
}