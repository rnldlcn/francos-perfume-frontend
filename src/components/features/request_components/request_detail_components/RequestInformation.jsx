import { MessageSquare } from "lucide-react";

export default function RequestInformation({ request }) {
    if (!request) return null;

    // Helper to format ISO date strings (e.g., "11/04/2026 6:70 AM")
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }) + " " + date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Request Information</h2>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span className="text-xs text-gray-400 block font-medium">From Branch</span>
                    <span className="font-semibold text-gray-800">
                        {request.requestedFrom || "N/A"}
                    </span>
                </div>
                <div>
                    <span className="text-xs text-gray-400 block font-medium">To Branch</span>
                    <span className="font-semibold text-gray-800">
                        {request.deliveredTo || "N/A"}
                    </span>
                </div>
                <div>
                    <span className="text-xs text-gray-400 block font-medium">Created By</span>
                    <span className="font-semibold text-gray-800">
                        {request.employeeDisplayId || "N/A"}
                    </span>
                </div>
                <div>
                    <span className="text-xs text-gray-400 block font-medium">Date Created</span>
                    <span className="font-semibold text-gray-800">
                        {formatDate(request.requestDateSubmitted)}
                    </span>
                </div>
            </div>

            {/* Request Message Box */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex gap-3 items-start">
                <div className="p-2 bg-indigo-500 rounded-lg text-white mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="font-bold text-indigo-950 text-sm">Request Message</h3>
                    <p className="text-xs text-indigo-600/80 mt-1 whitespace-pre-line leading-relaxed">
                        {request.requestMessage && request.requestMessage !== "string"
                            ? request.requestMessage
                            : "No request message provided."}
                    </p>
                </div>
            </div>
        </div>
    );
}