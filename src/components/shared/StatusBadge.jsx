import React from 'react';
import { Clock, Check, X, Truck, ShoppingCart } from 'lucide-react';

export default function StatusBadge({ status }) {
    // Normalize the status string to handle differences like "IN_TRANSIT" vs "In Transit"
    const normalizedStatus = (status || '').toUpperCase().replace(/_/g, ' ');

    // Define the visual mapping based on your design system
    let config = {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border border-gray-200',
        icon: Clock,
        label: normalizedStatus || 'UNKNOWN'
    };

    switch (normalizedStatus) {
        case 'MANAGER REVIEW':
        case 'OTHER MANAGER REVIEW':
        case 'REQUESTING MANAGER REVIEW':
        case 'FULFILLING MANAGER REVIEW':
            config = { bg: 'bg-purple-100', text: 'text-purple-600', border: '', icon: Clock, label: normalizedStatus };
            break;
        case 'OWNER REVIEW':
            config = { bg: 'bg-orange-100', text: 'text-orange-600', border: '', icon: Clock, label: 'OWNER REVIEW' };
            break;
        case 'APPROVED':
            config = { bg: 'bg-green-100', text: 'text-green-600', border: '', icon: Check, label: 'APPROVED' };
            break;
        case 'REJECTED':
        case 'CANCELLED':
            config = { bg: 'bg-red-100', text: 'text-red-700', border: '', icon: X, label: normalizedStatus };
            break;
        case 'COMPLETED':
            config = { bg: 'bg-green-100', text: 'text-green-600', border: '', icon: Check, label: 'COMPLETED' };
            break;
        case 'IN TRANSIT':
        case 'DISPATCHED':
            // Using Truck here, but you can swap to ShoppingCart if you prefer the dolly look!
            config = { bg: 'bg-indigo-100', text: 'text-indigo-600', border: '', icon: Truck, label: 'IN TRANSIT' };
            break;
        case 'FOR DISPATCH':
            config = { bg: 'bg-white', text: 'text-gray-700', border: 'border border-gray-400 shadow-sm', icon: Clock, label: 'FOR DISPATCH' };
            break;
        default:
            // Fallback for PENDING or anything else
            config = { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border border-yellow-200', icon: Clock, label: normalizedStatus };
            break;
    }

    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold capitalize ${config.bg} ${config.text} ${config.border}`}>
            {/* The icons in your mockup look filled, so we add fill="currentColor" to simulate that solid look where applicable */}
            <IconComponent size={14} strokeWidth={2.5} className={normalizedStatus === 'FOR DISPATCH' ? 'fill-gray-700' : ''} />
            {config.label.toLowerCase()}
        </span>
    );
}