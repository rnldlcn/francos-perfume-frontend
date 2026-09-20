import { CheckCircle2, Clock, Truck, XCircle } from "lucide-react";

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

export const renderBadgeForRequestTimeline = (status) => {
    switch (status?.toUpperCase()) {
        case "APPROVED":
        case "COMPLETED":
        case "DISPATCHED":
            return (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {status}
                </span>
            );
        case "REJECTED":
            return (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    {status}
                </span>
            );
        default:
            return (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    {status || "PENDING"}
                </span>
            );
    }
};

// Helper to render step icons
export const renderTimelineIcon = (status) => {
    switch (status?.toUpperCase()) {
        case "APPROVED":
        case "COMPLETED":
            return <CheckCircle2 className="w-6 h-6 text-emerald-600 bg-white rounded-full" />;
        case "DISPATCHED":
            return <Truck className="w-6 h-6 text-blue-600 bg-white rounded-full" />;
        case "REJECTED":
            return <XCircle className="w-6 h-6 text-red-600 bg-white rounded-full" />;
        default:
            return <Clock className="w-6 h-6 text-amber-500 bg-white rounded-full" />;
    }
};

export const buildContextualTimeline = (creatorRole, userRole, approvals, requestStatus) => {
    const normCreator = (creatorRole || "").toUpperCase();

    const getApprovalStatus = (stageName) => {
        const found = (approvals || []).find((a) =>
            a.stage?.toUpperCase().includes(stageName.toUpperCase())
        );
        return {
            subtitle: found?.approver || "Waiting for approval",
            status: found?.status || "PENDING",
        };
    };

    let steps = [];

    // --- USER STORY 3: OWNER STOCK REPLENISHMENT ---
    if (normCreator.includes("OWNER")) {
        const stage = getApprovalStatus("DESTINATION MANAGER");
        steps.push({
            title: "Destination Branch Manager Review",
            subtitle: stage.subtitle,
            status: stage.status,
        });
    }
    // --- USER STORY 4 & 5: SOURCE BRANCH MANAGER / STAFF ---
    else if (normCreator.includes("SOURCE")) {
        if (normCreator.includes("STAFF")) {
            const srcStage = getApprovalStatus("SOURCE MANAGER");
            steps.push({
                title: "Source Branch Review",
                subtitle: srcStage.subtitle,
                status: srcStage.status,
            });
        }
        const ownerStage = getApprovalStatus("OWNER");
        steps.push({
            title: "Owner Review",
            subtitle: ownerStage.subtitle,
            status: ownerStage.status,
        });
    }
    // --- USER STORY 1 & 2: REQUESTING BRANCH MANAGER / STAFF ---
    else {
        if (normCreator.includes("STAFF")) {
            const reqStage = getApprovalStatus("REQUESTING MANAGER");
            steps.push({
                title: "Request Branch Manager Review",
                subtitle: reqStage.subtitle,
                status: reqStage.status,
            });
        }
        const srcStage = getApprovalStatus("SOURCE MANAGER");
        steps.push({
            title: "Source Branch Manager Review",
            subtitle: srcStage.subtitle,
            status: srcStage.status,
        });

        const ownerStage = getApprovalStatus("OWNER");
        steps.push({
            title: "Owner Review",
            subtitle: ownerStage.subtitle,
            status: ownerStage.status,
        });
    }

    // --- COMMON END-STAGE FULFILLMENT STEPS ---
    const isDispatched =
        requestStatus === "IN TRANSIT" ||
        requestStatus === "OUT FOR DISPATCH" ||
        requestStatus === "COMPLETED";

    const isCompleted = requestStatus === "COMPLETED";

    steps.push({
        title: "For Dispatch",
        subtitle: isDispatched ? "Dispatched and on the way" : "Waiting for dispatch",
        status: isDispatched ? "DISPATCHED" : "PENDING",
    });

    steps.push({
        title: "Stock Arrival",
        subtitle: isCompleted ? "Delivery acknowledged" : "Waiting to be received",
        status: isCompleted ? "COMPLETED" : "PENDING",
    });

    // Mark steps after any rejection as skipped
    let rejectionFound = false;
    return steps.map((item) => {
        if (rejectionFound) return { ...item, isSkipped: true };
        if (item.status === "REJECTED") rejectionFound = true;
        return { ...item, isSkipped: false };
    });
};