import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye, ShoppingCart, Truck, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DeliveryCard = ({
    delivery,
    activeTab,
    onMarkInTransit,
    onCancelRequest,
    onAcceptRequest,
    onRejectRequest,
    onConfirmDelivery,
}) => {
    const navigate = useNavigate();

    const isInbound = delivery.direction === "INBOUND";
    const deliveryStatus = (delivery.deliveryStatus)

    const deliveryId = delivery.deliveryDisplayId;
    const route = `From ${delivery.fromBranchName} To ${delivery.toBranchName}`;
    const productCount = delivery.itemCount || 0;
    const unitCount = delivery.totalUnits || 0;

    const handleViewDetails = () => {
        navigate(`/home/deliveries/${delivery.deliveryId}`);
    };

    const renderActions = () => {
        if (activeTab === "FOR_DISPATCH") {
            if (!isInbound) {
                return (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {deliveryStatus == "PENDING" && (
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onMarkInTransit(delivery.deliveryId)}>
                                <Truck size={15} /> Mark as In Transit
                            </Button>
                        )}
                        {deliveryStatus !== "IN TRANSIT" && deliveryStatus !== "COMPLETED" && deliveryStatus !== "CANCELLED" && (
                            <Button variant="destructive" onClick={() => onCancelRequest(delivery.deliveryId)}>
                                <XCircle size={15} /> Cancel Request
                            </Button>
                        )}
                        <Button className="bg-custom-primary text-custom-black hover:bg-custom-primary/80" onClick={handleViewDetails}>
                            <Eye size={15} /> View Details
                        </Button>
                    </div>
                );
            }
            return (
                <div className="grid grid-cols-3 gap-2 mt-3">
                    {deliveryStatus !== "ACCEPTED" && deliveryStatus !== "COMPLETED" && (
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onAcceptRequest(delivery.deliveryId)}>
                            <CheckCircle size={15} /> Accept Request
                        </Button>
                    )}
                    {deliveryStatus !== "ACCEPTED" && deliveryStatus !== "COMPLETED" && (
                        <Button variant="destructive" onClick={() => onRejectRequest(delivery.deliveryId)}>
                            <XCircle size={15} /> Reject Request
                        </Button>
                    )}
                    <Button className="bg-custom-primary text-custom-black hover:bg-custom-primary/80" onClick={handleViewDetails}>
                        <Eye size={15} /> View Details
                    </Button>
                </div>
            );
        }

        if (activeTab === "OUTBOUND") {
            return (
                <Button className="w-full bg-custom-primary text-custom-black hover:bg-custom-primary/80 mt-3" onClick={handleViewDetails}>
                    <Eye size={15} /> View Details
                </Button>
            );
        }

        if (activeTab === "INBOUND") {
            return (
                <div className="grid grid-cols-2 gap-2 mt-3">
                    {deliveryStatus !== "COMPLETED" && (
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onConfirmDelivery(delivery.deliveryId)}>
                            <CheckCircle size={15} /> Confirm Delivery
                        </Button>
                    )}
                    <Button className="bg-custom-primary text-custom-black hover:bg-custom-primary/80" onClick={handleViewDetails}>
                        <Eye size={15} /> View Details
                    </Button>
                </div>
            );
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <ShoppingCart size={28} className="text-gray-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-custom-black">{deliveryId}</h3>
                            <StatusBadge
                                status={delivery.direction}
                            />
                            <StatusBadge
                                status={delivery.deliveryStatus}
                            />
                        </div>
                        {delivery.requestDisplayId && (
                            <p className="text-xs italic text-muted-foreground mt-0.5">
                                {delivery.requestDisplayId}
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground">{route}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-custom-black">{productCount} products</p>
                    <p className="text-xs text-muted-foreground">{unitCount} units</p>
                </div>
            </div>
            <div className="px-4 pb-4">
                {renderActions()}
            </div>
        </div>
    );
};

export default DeliveryCard;