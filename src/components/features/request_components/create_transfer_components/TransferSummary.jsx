import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const TransferSummary = ({ 
    fromBranch,
    toBranch,
    userBranchId,
    productCount,
    totalUnits,
    message,
    onMessageChange,
    onSubmit,
    isSubmitting,
}) => {
    const direction = fromBranch === userBranchId ? 'OUTBOUND' : 'INBOUND';
    const hasProducts = productCount > 0;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold text-foreground">Transfer Request Summary</h2>

            {/* Direction */}
            {fromBranch && toBranch && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center text-sm">
                    The request will be an{' '}
                    <span className="font-bold">{direction}</span> request
                </div>
            )}

            {/* Product count */}
            {hasProducts && (
                <div className="bg-gray-100 rounded-lg p-3 text-center text-sm font-medium text-foreground">
                    {productCount} product(s) and {totalUnits} unit(s)
                </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Message */}
            <div>
                <p className="text-sm font-semibold text-foreground mb-2">Request Message</p>
                <textarea
                    value={message}
                    onChange={(e) => onMessageChange(e.target.value)}
                    placeholder="Add your comments or message for this request...."
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-24 outline-none focus:border-gray-400 transition-colors"
                />
            </div>

            {/* Submit */}
            <Button
                variant="confirm"
                onClick={onSubmit}
                disabled={!hasProducts || !fromBranch || !toBranch || isSubmitting}
            >
                <Send size={16} />
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
        </div>
    );
};

export default TransferSummary;