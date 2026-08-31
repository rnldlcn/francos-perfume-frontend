import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks/request_hooks/useRequest";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequestInformation from "./request_detail_components/RequestInformation";
import RequestTimeline from "./request_detail_components/RequestTimeline";
import { requestedProductsColumns } from "./request_detail_components/RequestedProductsColumns";

export default function RequestDetailsPage() {
    const { 
        fetchRequestDetails,
    } = useRequest();

    const { requestId } = useParams();
    const navigate = useNavigate();
    const [requestPayload, setRequestPayload] = useState({});

    const [selectedRequest, setRequestDetails] = useState(null);
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
            [requestItemId]: { 
                ...prev[requestItemId],
                 isApproved,
                approvedQty: isApproved
                    ? prev[requestItemId]?.approvedQty : 0   
            },
        }));
    };

    const handleQtyChange = (requestItemId, approvedQty) => {
        const requestedQty = selectedRequest.items.find(
            item => item.requestItemId === requestItemId
        ).requestedQty || 0;

        const maximumQtyAllowed = Math.min(approvedQty, requestedQty);
    
        setItemApprovals((prev) => ({
                ...prev,
                [requestItemId]: { 
                    ...prev[requestItemId], 
                    approvedQty: maximumQtyAllowed,
                    isApproved: maximumQtyAllowed > 0
                },
            }));
    };


    const allProductsApproved = Object.values(itemApprovals).some((item) => item.isApproved);


    const isPending = selectedRequest?.requestStatus === "PENDING";

    const handleRejectRequest = async (requestId, requestPayload) => {
        // add reject endpoint here
    }
    
    const handleApproveRequest = async (requestId, requestPayload) => {
        // add confirm endpoint here
    }

    const handleCancelRequest = async (requestId) => {
        // add cancel endpoint here
    }

    if (!selectedRequest) {
        return <div className="p-6 text-custom-gray font-montserrat">Loading request details...</div>;
    }

    return (
        <div className="p-6 min-h-screen font-montserrat">
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
                        {selectedRequest.requestDisplayId}
                    </h1>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase">
                        {selectedRequest.requestStatus}
                    </span>
                </div>

                {isPending && (
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
                        request={selectedRequest} 
                    />

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Requested Products</h2>
                        <DataTable
                            columns={requestedProductsColumns(
                                itemApprovals, 
                                handleApproveToggle, 
                                handleQtyChange
                            )}
                            data={selectedRequest.items || []}
                            keyField="requestItemId"
                            showPagination={false}
                            showSearch={false}
                        />
                    </div>
                </div>

                <div>
                    <RequestTimeline
                        selectedRequest={selectedRequest}
                        setRequestPayload={setRequestPayload}
                        isPending={isPending}
                        allProductsApproved={allProductsApproved}
                    />
                </div>
            </div>
        </div>
    );
}