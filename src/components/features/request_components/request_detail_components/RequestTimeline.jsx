import { useAuth } from "@/auth/UseAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buildApprovalSteps, buildTimeline, renderBadgeForRequestTimeline, renderTimelineIcon } from "@/utils/timelineUtils";
import { Check, X } from "lucide-react";

const RequestTimeline = ({ selectedRequest, setRequestPayload, allProductsApproved, handleRejectRequest, handleApproveRequest, remarks, setRemarks}) => {
    
    const { user } = useAuth(); 

    const totalProducts = selectedRequest?.items?.length || 0;
    const totalUnits = selectedRequest?.items?.reduce((sum, item) => sum + item.receivedQty, 0);

    const approvalSteps = buildApprovalSteps(
        selectedRequest?.approvals,
        selectedRequest?.requestedFrom
    );

    const processedTimeline = buildTimeline(
        approvalSteps,
        selectedRequest?.requestStatus
    );

    const visibleTimeline = processedTimeline.filter(item => !item.isSkipped);

    // Bulletproof string extraction that safely handles Strings, IDs, and nested Objects
    const extractString = (val) => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') {
            return String(val.branchLocation || val.name || val.branchName || val.branchId || val.id || '').toUpperCase().trim();
        }
        return String(val).toUpperCase().trim();
    };

    // Intercept and restructure the timeline if the creator is an OWNER 
    // (Requires CreatorRole in your C# DTO)
    const creatorRole = extractString(selectedRequest?.creatorRole);
    let finalTimeline = [...visibleTimeline];

    if (creatorRole.includes('OWNER')) {
        // 1. Remove the redundant "Owner Review" step entirely
        finalTimeline = finalTimeline.filter(step => !step.title.toLowerCase().includes('owner review'));
        
        // 2. Rename the "Source Branch" step to act as the primary Owner Review
        finalTimeline = finalTimeline.map(step => {
            if (step.title.toLowerCase().includes('source branch')) {
                return { ...step, title: 'Owner Review' };
            }
            return step;
        });
    }

    // Use finalTimeline for all active step calculations
    const currentActiveStep = finalTimeline.find(step => step.status === 'PENDING' || step.status === 'IN_PROGRESS');
    
    const isRequestActive = !!currentActiveStep;
    const activeTitle = currentActiveStep?.title?.toLowerCase() || '';

    const userRole = extractString(user?.activeRole || user?.role);
    const isManager = userRole.includes('MANAGER');

    // MAPPED TO DTO: DeliveredTo, ToBranchId
    const destValues = [
        selectedRequest?.deliveredTo, 
        selectedRequest?.toBranchId
    ].map(extractString).filter(Boolean);

    // MAPPED TO DTO: RequestedFrom, FromBranchId
    const sourceValues = [
        selectedRequest?.requestedFrom, 
        selectedRequest?.fromBranchId
    ].map(extractString).filter(Boolean);

    const userLoc = extractString(user?.branchLocation);
    const userId = extractString(user?.branchId);

    // Check if the user's location OR ID matches any of the pooled destination/source values
    const isDestMatch = destValues.includes(userLoc) || destValues.includes(userId);
    const isSourceMatch = sourceValues.includes(userLoc) || sourceValues.includes(userId);

    let isAuthorizedToApprove = false;
    
    if (activeTitle.includes('destination') || activeTitle.includes('requesting') || activeTitle.includes('request branch')) {
        isAuthorizedToApprove = isManager && isDestMatch;
    } else if (activeTitle.includes('source')) {
        isAuthorizedToApprove = isManager && isSourceMatch;
    } else if (activeTitle.includes('owner')) {
        isAuthorizedToApprove = userRole.includes('OWNER');
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-custom-black mb-6">Timeline</h2>

                <div className="relative pl-3">
                    {/* Render using the newly filtered finalTimeline */}
                    {finalTimeline.map((item, index) => {
                        const isLast = index === finalTimeline.length - 1;
                        return (
                            <div key={index} className="relative flex gap-4 pb-8 last:pb-0 transition-opacity opacity-100">
                                {!isLast && (
                                    <div className="absolute left-2.75 top-6 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300" />
                                )}

                                <div className="relative z-10 shrink-0">
                                    {renderTimelineIcon(item.status)}
                                </div>  
                                
                                <div className="grow flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-sm leading-tight text-custom-black">
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
                        <div className="flex justify-between">
                            <span className="text-gray-400">Approved Units:</span>
                            <span className="font-bold text-emerald-600">{"wip"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isRequestActive && (
                isAuthorizedToApprove ? (
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
                                    onClick={() => handleApproveRequest(selectedRequest.requestId)}
                                    variant="confirm"
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                                >
                                    <Check className="w-4 h-4 mr-2" /> Approve Request
                                </Button>
                            )}
                            <Button
                                onClick={() => handleRejectRequest(selectedRequest.requestId)}
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
                            This request is currently pending review for the <span className="font-bold text-gray-700">{currentActiveStep?.title || 'next stage'}</span>. 
                            You are not authorized to approve or reject at this time.
                        </p>
                    </div>
                )
            )}
        </div>
    );
};

export default RequestTimeline;