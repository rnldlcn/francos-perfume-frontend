import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, CheckCircle2, Clock, User, X, XCircle } from "lucide-react";

const RequestTimeline = ({
    selectedRequest,
    isWarehousePush,
    canApprove,
    remarks,
    setRemarks,
    allProductsApproved,
    isSubmitting,
    setShowApproveModal,
    handleAction,
    totalProducts,
    totalRequestedUnits,
    totalApprovedUnits,
}) => {
    // Standardize timeline step badges
    const renderBadge = (status) => {
        switch (status) {
            case "APPROVED":
            case "COMPLETED":
            case "DISPATCHED":
                return (
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-none px-3 py-0.5 font-medium rounded-md text-xs">
                        {status === "APPROVED" ? "Approved" : status}
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-none px-3 py-0.5 font-medium rounded-md text-xs">
                        Rejected
                    </Badge>
                );
            case "PENDING":
            default:
                return (
                    <Badge variant="outline" className="bg-amber-100 text-amber-600 border-none px-3 py-0.5 font-medium rounded-md text-xs">
                        Pending
                    </Badge>
                );
        }
    };

    const renderIcon = (status) => {
        if (status === "APPROVED" || status === "COMPLETED" || status === "DISPATCHED") {
            return <CheckCircle2 className="w-6 h-6 text-emerald-500 bg-white rounded-full" />;
        }
        if (status === "REJECTED") {
            return <XCircle className="w-6 h-6 text-red-500 bg-white rounded-full" />;
        }
        return <Clock className="w-6 h-6 text-amber-500 bg-white rounded-full" />;
    };

    const approvalSteps = (selectedRequest?.approvals || [])
        .filter((approval) => !(isWarehousePush && approval.stage === "FULFILLING_MANAGER"))
        .map((approval) => {
            let stageName = approval.stage.toLowerCase().replace("_", " ");
            if (isWarehousePush && approval.stage === "REQUESTING_MANAGER") {
                stageName = "receiving manager";
            }
            return {
                title: `${stageName.replace(/\b\w/g, (l) => l.toUpperCase())} Review`,
                subtitle: approval.approver ? (
                    <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {approval.approver}
                    </span>
                ) : (
                    "Waiting for approval"
                ),
                status: approval.status,
            };
        });

    const isDispatched = selectedRequest?.request_status === "IN TRANSIT" || selectedRequest?.request_status === "COMPLETED";
    const isCompleted = selectedRequest?.request_status === "COMPLETED";

    const fullTimeline = [
        ...approvalSteps,
        {
            title: "For Dispatch",
            subtitle: isDispatched ? "Dispatched and on the way" : "Waiting for dispatch",
            status: isDispatched ? "DISPATCHED" : "PENDING",
        },
        {
            title: "Stock Received",
            subtitle: isCompleted ? "Delivery acknowledged" : "Waiting to be dispatched",
            status: isCompleted ? "COMPLETED" : "PENDING",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Timeline</h2>

                <div className="relative pl-3">
                    {fullTimeline.map((item, index) => {
                        const isLast = index === fullTimeline.length - 1;
                        return (
                            <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
                                {/* Dashed Connector Line */}
                                {!isLast && (
                                    <div className="absolute left-[11px] top-6 bottom-0 w-[2px] border-l-2 border-dashed border-gray-300" />
                                )}

                                {/* Icon Node */}
                                <div className="relative z-10 flex-shrink-0">{renderIcon(item.status)}</div>

                                {/* Content Node */}
                                <div className="flex-grow flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h3>
                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1 font-medium">
                                            {item.subtitle}
                                        </div>
                                    </div>
                                    <div>{renderBadge(item.status)}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <hr className="my-6 border-gray-300" />

                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
                    <div className="space-y-2 text-sm font-medium">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Products:</span>
                            <span className="font-bold text-gray-900">{totalProducts ?? 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Units:</span>
                            <span className="font-bold text-gray-900">{totalRequestedUnits ?? 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Approved Units:</span>
                            <span className="font-bold text-emerald-600">{totalApprovedUnits ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Required Action Box */}
            {canApprove && (
                <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm space-y-4">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Required Action</h2>
                        <p className="text-xs text-gray-500">You are authorized to review this stage.</p>
                    </div>

                    <Textarea
                        placeholder="Add remarks (required for rejection)..."
                        className="resize-none h-20 text-sm border-gray-200 focus:border-gray-400"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />

                    <div className="space-y-2">
                        {allProductsApproved && (
                        <Button
                            onClick={() => setShowApproveModal(true)}
                            disabled={isSubmitting}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
                        >
                            <Check className="w-4 h-4 mr-2" /> Approve Request
                        </Button>
                        )}
                        <Button
                            onClick={() => handleAction("REJECT")}
                            disabled={isSubmitting}
                            variant="destructive"
                            className="w-full bg-rose-800 hover:bg-rose-900 font-bold h-11"
                        >
                            <X className="w-4 h-4 mr-2" /> Reject Request
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestTimeline;