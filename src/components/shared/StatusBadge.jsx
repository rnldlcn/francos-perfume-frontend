import { Check, Clock, Package, PackageCheck, Truck, X } from 'lucide-react';

export default function StatusBadge({ status }) {
    const normalizedStatus = (status || '').toUpperCase().replace(/_/g, ' ');

    let config = {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border border-gray-200',
        icon: Clock,
        label: normalizedStatus || 'UNKNOWN'
    };

    switch (normalizedStatus) {
        // ── Request review states ────────────────────────────────────────
        case 'MANAGER REVIEW':
        case 'OTHER MANAGER REVIEW':
        case 'REQUESTING MANAGER REVIEW':
        case 'FULFILLING MANAGER REVIEW':
            config = { bg: 'bg-purple-100', text: 'text-purple-600', border: '', icon: Clock, label: normalizedStatus };
            break;
        case 'OWNER REVIEW':
            config = { bg: 'bg-orange-100', text: 'text-orange-600', border: '', icon: Clock, label: 'OWNER REVIEW' };
            break;

        // ── Generic positive states ──────────────────────────────────────
        case 'APPROVED':
        case 'ACCEPTED':
            config = { bg: 'bg-green-100', text: 'text-green-600', border: '', icon: Check, label: normalizedStatus };
            break;

        // ── Generic negative states ──────────────────────────────────────
        case 'REJECTED':
        case 'CANCELLED':
        case 'CANCELED':
            config = { bg: 'bg-red-100', text: 'text-red-700', border: '', icon: X, label: normalizedStatus };
            break;

        // ── Delivery states ──────────────────────────────────────────────
        case 'COMPLETED':
            config = { bg: 'bg-green-100', text: 'text-green-600', border: '', icon: Check, label: 'COMPLETED' };
            break;
        case 'PARTIALLY COMPLETED':
        case 'PARTIAL':
        case 'PARTIALLY RECEIVED':
            config = { bg: 'bg-amber-100', text: 'text-amber-700', border: '', icon: PackageCheck, label: 'PARTIALLY COMPLETED' };
            break;
        case 'IN TRANSIT':
        case 'DISPATCHED':
            config = { bg: 'bg-indigo-100', text: 'text-indigo-600', border: '', icon: Truck, label: 'IN TRANSIT' };
            break;
        case 'FOR DISPATCH':
        case 'PENDING':
        case 'CREATED':
            config = { bg: 'bg-white', text: 'text-gray-700', border: 'border border-gray-400 shadow-sm', icon: Clock, label: normalizedStatus };
            break;
        case 'RECEIVED':
        case 'DELIVERED':
            config = { bg: 'bg-emerald-100', text: 'text-emerald-600', border: '', icon: PackageCheck, label: normalizedStatus };
            break;

        // ── Direction (used by StatusBadge in DeliveryCard header) ───────
        case 'INBOUND':
            config = { bg: 'bg-amber-100', text: 'text-amber-700', border: '', icon: Package, label: 'INBOUND' };
            break;
        case 'OUTBOUND':
            config = { bg: 'bg-purple-100', text: 'text-purple-700', border: '', icon: Truck, label: 'OUTBOUND' };
            break;

        default:
            config = { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border border-yellow-200', icon: Clock, label: normalizedStatus };
            break;
    }

    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold capitalize ${config.bg} ${config.text} ${config.border}`}>
            <IconComponent size={14} strokeWidth={2.5} className={normalizedStatus === 'FOR DISPATCH' ? 'fill-gray-700' : ''} />
            {config.label.toLowerCase()}
        </span>
    );
}