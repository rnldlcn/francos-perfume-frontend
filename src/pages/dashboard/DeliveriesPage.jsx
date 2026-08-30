import DeliveryCard from "@/components/features/delivery_components/DeliveryCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import SearchBar from "@/components/shared/SearchBar";
import StatusCard from "@/components/shared/StatusCard";
import { Clock } from "lucide-react";
import { useState } from "react";

const TABS = [
    { key: "FOR_DISPATCH", label: "For Dispatch" },
    { key: "OUTBOUND", label: "Outbound Deliveries" },
    { key: "INBOUND", label: "Inbound Deliveries" },
];

const DeliveriesPage = () => {
    const [activeTab, setActiveTab] = useState("FOR_DISPATCH");
    const [searchQuery, setSearchQuery] = useState("");
    const [config, setConfig] = useState(null);

    // TODO: Replace with useDelivery hook
    const deliveries = [];

    // TODO: Replace with real stats from useDelivery hook
    const stats = {
        forDispatch: { inbound: 0, outbound: 0 },
        outbound: { inTransit: 0, completed: 0 },
        inbound: { inTransit: 0, completed: 0 },
    };

    const filteredDeliveries = deliveries.filter(d => {
        const matchesTab =
            activeTab === "FOR_DISPATCH" ? d.deliveryStatus === "FOR DISPATCH"
            : activeTab === "OUTBOUND" ? d.direction === "OUTBOUND" && d.deliveryStatus !== "FOR DISPATCH"
            : d.direction === "INBOUND" && d.deliveryStatus !== "FOR DISPATCH";

        const matchesSearch = !searchQuery ||
            d.deliveryDisplayId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.fromBranch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.toBranch?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const handleMarkInTransit = (deliveryId) => {
        setConfig({
            title: "Mark as In Transit?",
            description: "This will notify the receiving branch that the delivery is on its way.",
            confirmText: "Mark In Transit",
            onConfirm: async () => {
                // TODO: await markInTransit(deliveryId, user?.accessToken);
                // TODO: refresh();
            }
        });
    };

    const handleCancelRequest = (deliveryId) => {
        setConfig({
            title: "Cancel this request?",
            description: "This cannot be undone. The request will be terminated.",
            confirmText: "Cancel Request",
            onConfirm: async () => {
                // TODO: await cancelDelivery(deliveryId, user?.accessToken);
                // TODO: refresh();
            }
        });
    };

    const handleAcceptRequest = (deliveryId) => {
        setConfig({
            title: "Accept this delivery request?",
            description: "You are confirming that you accept this inbound delivery.",
            confirmText: "Accept Request",
            onConfirm: async () => {
                // TODO: await acceptDelivery(deliveryId, user?.accessToken);
                // TODO: refresh();
            }
        });
    };

    const handleRejectRequest = (deliveryId) => {
        setConfig({
            title: "Reject this delivery request?",
            description: "This will notify the source branch that the request has been rejected.",
            confirmText: "Reject Request",
            onConfirm: async () => {
                // TODO: await rejectDelivery(deliveryId, user?.accessToken);
                // TODO: refresh();
            }
        });
    };

    const handleConfirmDelivery = (deliveryId) => {
        // TODO: navigate(`/home/deliveries/confirm/${deliveryId}`) instead of dialog
        setConfig({
            title: "Confirm delivery received?",
            description: "This will mark the delivery as completed and update your inventory.",
            confirmText: "Confirm Delivery",
            onConfirm: async () => {
                // TODO: await confirmDelivery(deliveryId, user?.accessToken);
                // TODO: refresh();
            }
        });
    };

    return (
        <div className="flex flex-col h-full animate-fade-in font-montserrat">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-custom-black tracking-tight leading-none mb-1">
                    Deliveries
                </h1>
                <p className="text-muted-foreground text-sm">Manage send requests</p>
            </div>

            {/* ✅ StatusCard components */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatusCard
                    title="Pending Dispatches"
                    Icon={Clock}
                    // TODO: replace with stats.forDispatch.inbound and stats.forDispatch.outbound
                    secondValue={`${stats.forDispatch.inbound}`}
                    subText=" inbound, "
                    thirdValue={`${stats.forDispatch.outbound}`}
                    secondSubText=" outbound"
                />
                <StatusCard
                    title="Outbound Deliveries"
                    Icon={Clock}
                    // TODO: replace with stats.outbound.inTransit and stats.outbound.completed
                    secondValue={`${stats.outbound.inTransit}`}
                    subText=" in-transit "
                    thirdValue={`${stats.outbound.completed}`}
                    secondSubText=" completed"
                />
                <StatusCard
                    title="Inbound Deliveries"
                    Icon={Clock}
                    // TODO: replace with stats.inbound.inTransit and stats.inbound.completed
                    secondValue={`${stats.inbound.inTransit}`}
                    subText=" in-transit "
                    thirdValue={`${stats.inbound.completed}`}
                    secondSubText=" completed"
                />
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-colors border ${
                            activeTab === tab.key
                                ? "bg-custom-primary border-custom-primary text-custom-black"
                                : "bg-white border-gray-200 text-muted-foreground hover:bg-gray-50"
                        }`}
                    >
                        {/* TODO: Add real counts from useDelivery hook */}
                        {tab.label} ({filteredDeliveries.length})
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="mb-4">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                {/* TODO: Add FilterDropDown for Status and Acknowledge filters */}
            </div>

            {/* Delivery Cards */}
            <div className="flex-1 overflow-y-auto space-y-4">
                {filteredDeliveries.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        No deliveries found.
                    </div>
                ) : (
                    filteredDeliveries.map(delivery => (
                        <DeliveryCard
                            key={delivery.deliveryId}
                            delivery={delivery}
                            activeTab={activeTab}
                            onMarkInTransit={handleMarkInTransit}
                            onCancelRequest={handleCancelRequest}
                            onAcceptRequest={handleAcceptRequest}
                            onRejectRequest={handleRejectRequest}
                            onConfirmDelivery={handleConfirmDelivery}
                        />
                    ))
                )}
            </div>

            <ConfirmDialog
                isOpen={!!config}
                onClose={() => setConfig(null)}
                config={config}
            />
        </div>
    );
};

export default DeliveriesPage;