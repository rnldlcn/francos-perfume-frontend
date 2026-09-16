import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export const renderBadgeForRequestTimeline = (status) => {
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
    };
}

export const renderTimelineIcon = (status) => {
    if (status === "APPROVED" || status === "COMPLETED" || status === "DISPATCHED") {
        return <CheckCircle2 className="w-6 h-6 text-emerald-500 bg-white rounded-full" />;
    }
    if (status === "REJECTED") {
        return <XCircle className="w-6 h-6 text-red-500 bg-white rounded-full" />;
    }
    return <Clock className="w-6 h-6 text-amber-500 bg-white rounded-full" />;
};

export const buildTimeline = (approvalSteps, requestStatus) => {
    const isDispatched = requestStatus === "IN TRANSIT" || requestStatus === "COMPLETED";
    const isCompleted = requestStatus === "COMPLETED";

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

    let rejectionFound = false;
    return fullTimeline.map((item) => {
        if (rejectionFound) return { ...item, isSkipped: true };
        if (item.status === "REJECTED") rejectionFound = true;
        return { ...item, isSkipped: false };
    });
};

export const buildApprovalSteps = (approvals, requestedFrom) => {
    const isWarehousePush = requestedFrom?.toUpperCase() === "WAREHOUSE";

    return (approvals || [])
        .filter(approval => !(isWarehousePush && approval.stage === "FULFILLING MANAGER"))
        .map(approval => {
            let stageName = approval.stage.toLowerCase();
            if (isWarehousePush && approval.stage === "REQUESTING MANAGER") {
                stageName = "receiving manager";
            }
            return {
                title: `${stageName.replace(/\b\w/g, l => l.toUpperCase())} Review`,
                subtitle: approval.approver || "Waiting for approval",
                status: approval.status,
            };
        });
};