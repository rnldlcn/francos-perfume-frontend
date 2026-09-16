import { Button } from "@/components/ui/button";
import { useDelivery } from "@/hooks/delivery_hooks/useDelivery";
import { ArrowLeft, Truck, XCircle, CheckCircle, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeliveryInformation from "./delivery_detail_components/DeliveryInformation";

export default function DeliveryDetailsPage() {
    const { deliveryId } = useParams();
    const navigate = useNavigate();
    const { fetchDeliveryDetails } = useDelivery();

    const [selectedDelivery, setSelectedDelivery] = useState(null);

    useEffect(() => {
        if (!deliveryId) return;

        let isMounted = true;
        fetchDeliveryDetails(deliveryId).then((data) => {
            if (isMounted && data) {
                setSelectedDelivery(data);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [deliveryId, fetchDeliveryDetails]);

    if (!selectedDelivery) {
        return (
            <div className="p-6 text-custom-gray font-montserrat">
                Loading delivery details...
            </div>
        );
    }

    const isInbound = selectedDelivery.direction === "INBOUND";
    const isOutbound = selectedDelivery.direction === "OUTBOUND";
    const isForDispatch = !isInbound && !isOutbound; // Backend sends a generic status before dispatch

    const totalProducts = selectedDelivery.items?.length || 0;
    const totalUnits = selectedDelivery.items?.reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <div className="p-6 min-h-screen font-montserrat">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    onClick={() => navigate("/home/deliveries")}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <h1 className="text-2xl font-bold text-custom-black">
                    {selectedDelivery.deliveryDisplayId}
                </h1>
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                    isInbound
                        ? "bg-amber-100 text-amber-700"
                        : "bg-purple-100 text-purple-700"
                }`}>
                    {selectedDelivery.direction}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DeliveryInformation delivery={selectedDelivery} />

                    {/* Products Table */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Products</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-muted-foreground">
                                        <th className="pb-3 text-left font-medium">ID</th>
                                        <th className="pb-3 text-left font-medium">Perfume Name</th>
                                        <th className="pb-3 text-center font-medium">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(selectedDelivery.items || []).map((item, index) => (
                                        <tr
                                            key={item.deliveryItemId || index}
                                            className="border-b border-gray-50 last:border-0"
                                        >
                                            <td className="py-4 text-muted-foreground">{item.productDisplayId}</td>
                                            <td className="py-4 font-medium text-custom-black">{item.productName}</td>
                                            <td className="py-4 text-center font-bold">{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Summary + Actions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
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

                    {isForDispatch && (
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
                            <h2 className="text-base font-bold text-gray-900">Required Action</h2>
                            <p className="text-xs text-gray-500">Mark as in transit to notify the receiving branch.</p>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => navigate("/home/deliveries")}
                            >
                                <Truck className="w-4 h-4 mr-2" /> Mark as In Transit
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => navigate("/home/deliveries")}
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Cancel Request
                            </Button>
                        </div>
                    )}

                    {isInbound && (
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
                            <h2 className="text-base font-bold text-gray-900">Required Action</h2>
                            <p className="text-xs text-gray-500">Accept or reject this inbound request.</p>
                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => navigate("/home/deliveries")}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> Accept Request
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => navigate("/home/deliveries")}
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Reject Request
                            </Button>
                        </div>
                    )}

                    {isOutbound && (
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
                            <h2 className="text-base font-bold text-gray-900">Required Action</h2>
                            <p className="text-xs text-gray-500">View or follow up on this outbound delivery.</p>
                            <Button
                                className="w-full bg-custom-primary text-custom-black hover:bg-custom-primary/80"
                                onClick={() => navigate("/home/deliveries")}
                            >
                                <Eye className="w-4 h-4 mr-2" /> View Details
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}