import { useAuth } from "@/auth/UseAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buildContextualTimeline, renderBadgeForRequestTimeline, renderTimelineIcon } from "@/utils/timelineUtils";
import { Check, X } from "lucide-react";

const RequestTimeline = ({
    selectedRequest,
    allProductsApproved,
    handleRejectRequest,
    handleApproveRequest,
    remarks,
    setRemarks,
}) => {
    const { user } = useAuth();

    const totalProducts = selectedRequest?.items?.length || 0;
    const totalUnits = selectedRequest?.items?.reduce((sum, item) => sum + (item.receivedQty || 0), 0);

    const userRole = user?.activeRole || user?.role || "";
    const creatorRole = selectedRequest?.creatorRole || "";

    // Build timeline matching contextual user story logic
    const fullTimeline = buildContextualTimeline(
        creatorRole,
        userRole,
        selectedRequest?.approvals,
        selectedRequest?.requestStatus
    );

    const visibleTimeline = fullTimeline.filter((item) => !item.isSkipped);

    // Identify active step requiring approval
    const currentActiveStep = visibleTimeline.find(
        (step) => step.status === "PENDING" || step.status === "IN_PROGRESS"
    );

    const isRequestActive = !!currentActiveStep;
    const activeTitle = currentActiveStep?.title?.toLowerCase() || "";

    // Authorization check based on active step title
    const normUserRole = userRole.toUpperCase();
    let isAuthorizedToApprove = false;

    if (activeTitle.includes("destination") || activeTitle.includes("request")) {
        isAuthorizedToApprove = normUserRole.includes("MANAGER");
    } else if (activeTitle.includes("source")) {
        isAuthorizedToApprove = normUserRole.includes("MANAGER");
    } else if (activeTitle.includes("owner")) {
        isAuthorizedToApprove = normUserRole.includes("OWNER");
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Timeline</h2>

                <div className="relative pl-3">
                    {visibleTimeline.map((item, index) => {
                        const isLast = index === visibleTimeline.length - 1;
                        return (
                            <div
                                key={index}
                                className="relative flex gap-4 pb-8 last:pb-0 transition-opacity opacity-100"
                            >
                                {!isLast && (
                                    <div className="absolute left-[11px] top-6 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300" />
                                )}

                                <div className="relative z-10 shrink-0">
                                    {renderTimelineIcon(item.status)}
                                </div>

                                <div className="grow flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-sm leading-tight text-gray-900">
                                            {item.title}
                                        </h3>
                                        <div className="text-xs mt-1 flex items-center gap-1 font-medium text-gray-400">
                                            {item.subtitle}
                                        </div>
                                    </div>
                                    <div>{renderBadgeForRequestTimeline(item.status)}</div>
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
                            <span className="font-bold text-gray-900">{totalProducts}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Units:</span>
                            <span className="font-bold text-gray-900">{totalUnits}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval / Action Section */}
            {isRequestActive && (
                isAuthorizedToApprove ? (
                    <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm space-y-4">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Required Action</h2>
                            <p className="text-xs text-gray-500">
                                You are authorized to review this stage.
                            </p>
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
                                    onClick={() => handleApproveRequest(selectedRequest?.requestId)}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                                >
                                    <Check className="w-4 h-4 mr-2" /> Approve Request
                                </Button>
                            )}
                            <Button
                                onClick={() => handleRejectRequest(selectedRequest?.requestId)}
                                variant="destructive"
                                className="w-full font-bold"
                                disabled={!remarks.trim()}
                            >
                                <X className="w-4 h-4 mr-2" /> Reject Request
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 text-center">
                        <h2 className="text-base font-bold text-gray-900">Waiting for Approval</h2>
                        <p className="text-sm text-gray-500">
                            This request is currently pending review for{" "}
                            <span className="font-bold text-gray-700">
                                {currentActiveStep?.title || "the next stage"}
                            </span>
                            . You are not authorized to approve or reject at this time.
                        </p>
                    </div>
                )
            )}
        </div>
    );
};

export default RequestTimeline;