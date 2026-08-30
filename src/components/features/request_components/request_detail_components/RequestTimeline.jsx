import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buildApprovalSteps, buildTimeline, renderBadgeForRequestTimeline, renderTimelineIcon } from "@/utils/timelineUtils";
import { Check, Clock, X } from "lucide-react";

const RequestTimeline = ({ selectedRequest, setRequestPayload, allProductsApproved, isPending, }) => {

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

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-custom-black mb-6">Timeline</h2>

                <div className="relative pl-3">
                    {processedTimeline.map((item, index) => {
                        const isLast = index === processedTimeline.length - 1;
                        return (
                            <div
                                key={index}
                                className={`relative flex gap-4 pb-8 last:pb-0 transition-opacity ${
                                    item.isSkipped ? 'opacity-30 pointer-events-none' : 'opacity-100'
                                }`}
                            >
            {!isLast && (
                <div className={`absolute left-2.75 top-6 bottom-0 w-0.5 border-l-2 border-dashed ${
                    item.isSkipped ? 'border-gray-200' : 'border-gray-300'
                }`} />
            )}

            <div className="relative z-10 shrink-0">
                {item.isSkipped 
                    ? <Clock className="w-6 h-6 text-custom-gray bg-white rounded-full" />
                    : renderTimelineIcon(item.status)
                }
                        </div>  
                            {/* Content */}
                            <div className="grow flex justify-between items-start">
                                <div>
                                    <h3 className={`font-bold text-sm leading-tight ${
                                        item.isSkipped ? 'text-custom-gray' : 'text-custom-black'
                                    }`}>
                                        {item.title}
                                    </h3>
                                    <div className={`text-xs mt-1 flex items-center gap-1 font-medium ${
                                        item.isSkipped ? 'text-custom-gray' : 'text-gray-400'
                                    }`}>
                                        {item.isSkipped ? 'Skipped' : item.subtitle}
                                    </div>
                                </div>
                                {!item.isSkipped && <div>{renderBadgeForRequestTimeline(item.status)}</div>}
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

            {isPending && (
                <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm space-y-4">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Required Action</h2>
                        <p className="text-xs text-gray-500">You are authorized to review this stage.</p>
                    </div>

                    <Textarea
                        placeholder="Add remarks (required for rejection)..."
                        className="resize-none h-20 text-sm border-gray-200 focus:border-gray-400"
                        value={selectedRequest.remarks}
                        onChange={(e) => setRequestPayload(e.target.value)}
                    />

                    <div className="space-y-2">
                        {allProductsApproved && (
                            <Button
                                //onClick={() => setShowApproveModal(true)}
                                variant="confirm"
                                className="w-full"
                            >
                                <Check className="w-4 h-4 mr-2" /> Approve Request
                            </Button>
                            )}
                            <Button
                                //onClick={() => handleAction("REJECT")}
                                variant="destructive"
                                className="w-full"
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