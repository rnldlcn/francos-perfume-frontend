import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// TODO: Replace with your actual useDelivery hook
// import { useDelivery } from "@/hooks/delivery_hooks/useDelivery";

// Reason options for partial/missing items
// TODO: Confirm these reason options with your backend enum values
const REASON_OPTIONS = [
    { label: "Select reason...", value: "" },
    { label: "Damaged", value: "DAMAGED" },
    { label: "Missing", value: "MISSING" },
    { label: "Incorrect Item", value: "INCORRECT" },
    { label: "Expired", value: "EXPIRED" },
];

const DeliveryConfirmationPage = () => {
    const { deliveryId } = useParams();
    const navigate = useNavigate();
    const [config, setConfig] = useState(null);
    const [remarks, setRemarks] = useState("");

    // TODO: Replace with real data from useDelivery hook
    // const { fetchDeliveryDetails, confirmDelivery, asyncState } = useDelivery();
    const [delivery, setDelivery] = useState(null);

    // Track per-item received state
    // { [itemId]: { isReceived: bool, receivedQty: number, reason: string } }
    const [itemReceipts, setItemReceipts] = useState({});

    useEffect(() => {
        if (!deliveryId) return;
        // TODO: fetch delivery details
        // fetchDeliveryDetails(deliveryId).then(data => {
        //     setDelivery(data);
        //     const initial = {};
        //     (data.items || []).forEach(item => {
        //         initial[item.deliveryItemId] = {
        //             isReceived: true,
        //             receivedQty: item.requestedQty,
        //             reason: "",
        //         };
        //     });
        //     setItemReceipts(initial);
        // });
    }, [deliveryId]);

    const handleReceiveToggle = (itemId, isReceived) => {
        setItemReceipts(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                isReceived,
                receivedQty: isReceived ? prev[itemId]?.receivedQty || 0 : 0,
                reason: isReceived ? "" : prev[itemId]?.reason,
            }
        }));
    };

    const handleQtyChange = (itemId, qty) => {
        setItemReceipts(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                receivedQty: Number(qty),
            }
        }));
    };

    const handleReasonChange = (itemId, reason) => {
        setItemReceipts(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], reason }
        }));
    };

    const handleConfirm = () => {
        setConfig({
            title: "Confirm delivery received?",
            description: "This will update your inventory and mark the delivery as completed.",
            confirmText: "Confirm Delivery",
            onConfirm: async () => {
                // TODO: Build payload and call confirmDelivery service
                // const payload = {
                //     remarks,
                //     items: Object.entries(itemReceipts).map(([itemId, data]) => ({
                //         deliveryItemId: Number(itemId),
                //         isReceived: data.isReceived,
                //         receivedQty: data.receivedQty,
                //         reason: data.reason,
                //     }))
                // };
                // await confirmDelivery(deliveryId, payload, user?.accessToken);
                // navigate("/home/deliveries");
            }
        });
    };

    // TODO: Replace with actual delivery data check
    if (!delivery) {
        return (
            <div className="flex items-center justify-center h-full font-montserrat text-muted-foreground">
                {/* TODO: Add Skeleton loading state here */}
                Loading delivery details...
            </div>
        );
    }

    // TODO: Replace with actual field names from your delivery DTO
    const isInbound = delivery.direction === "INBOUND";

    return (
        <div className="flex flex-col h-full font-montserrat animate-fade-in">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={16} /> Back
                </Button>

                <h1 className="text-2xl font-bold text-custom-black">
                    {/* TODO: delivery.deliveryDisplayId */}
                    DEL-001
                </h1>

                <Badge
                    variant="outline"
                    className={`font-semibold border-none ${
                        isInbound
                            ? "bg-amber-100 text-amber-700"
                            : "bg-purple-100 text-purple-700"
                    }`}
                >
                    {/* TODO: delivery.direction */}
                    INBOUND
                </Badge>
            </div>

            {/* Requested Products Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-custom-black mb-4">Requested Products</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-muted-foreground">
                                <th className="pb-3 text-left font-medium">ID</th>
                                <th className="pb-3 text-left font-medium">Perfume Name</th>
                                <th className="pb-3 text-center font-medium">Requested Qty</th>
                                <th className="pb-3 text-center font-medium">Received?</th>
                                <th className="pb-3 text-center font-medium">Received Qty</th>
                                <th className="pb-3 text-left font-medium">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* TODO: Replace with delivery.items.map() */}
                            {/* Example structure:
                            {(delivery.items || []).map(item => {
                                const receipt = itemReceipts[item.deliveryItemId] || {};
                                return (
                                    <tr key={item.deliveryItemId} className="border-b border-gray-50 last:border-0">
                                        <td className="py-4 text-muted-foreground">{item.productDisplayId}</td>
                                        <td className="py-4 font-medium text-custom-black">{item.productName}</td>
                                        <td className="py-4 text-center font-bold">{item.requestedQty}</td>
                                        <td className="py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={receipt.isReceived ?? true}
                                                onChange={e => handleReceiveToggle(item.deliveryItemId, e.target.checked)}
                                                className="w-5 h-5 accent-emerald-600 cursor-pointer"
                                            />
                                        </td>
                                        <td className="py-4 text-center">
                                            <input
                                                type="number"
                                                value={receipt.receivedQty ?? item.requestedQty}
                                                onChange={e => handleQtyChange(item.deliveryItemId, e.target.value)}
                                                disabled={!receipt.isReceived}
                                                className="w-20 text-center border border-gray-200 rounded px-2 py-1 disabled:bg-gray-50 disabled:text-gray-300"
                                                min={0}
                                                max={item.requestedQty}
                                            />
                                        </td>
                                        <td className="py-4">
                                            <select
                                                value={receipt.reason || ""}
                                                onChange={e => handleReasonChange(item.deliveryItemId, e.target.value)}
                                                disabled={receipt.isReceived}
                                                className="border border-gray-200 rounded px-2 py-1 text-sm disabled:bg-gray-50 disabled:text-gray-300 w-full"
                                            >
                                                {REASON_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })} */}

                            {/* Placeholder row — remove once real data is connected */}
                            <tr className="border-b border-gray-50">
                                <td className="py-4 text-muted-foreground">PERF-001</td>
                                <td className="py-4 font-medium">Hibana no.5</td>
                                <td className="py-4 text-center font-bold">50</td>
                                <td className="py-4 text-center">
                                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600" />
                                </td>
                                <td className="py-4 text-center">
                                    <input
                                        type="number"
                                        defaultValue={50}
                                        className="w-20 text-center border border-gray-200 rounded px-2 py-1"
                                    />
                                </td>
                                <td className="py-4">
                                    <select className="border border-gray-200 rounded px-2 py-1 text-sm w-full">
                                        {REASON_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-custom-black mb-4">Additional Remarks</h2>
                <textarea
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Add your comments or message for this request...."
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-28 outline-none focus:border-gray-400 transition-colors"
                />
            </div>

            <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-base"
                onClick={handleConfirm}
            >
                <CheckCircle size={18} /> Confirm Delivery
            </Button>

            <ConfirmDialog
                isOpen={!!config}
                onClose={() => setConfig(null)}
                config={config}
            />
        </div>
    );
};

export default DeliveryConfirmationPage;