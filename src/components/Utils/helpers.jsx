import React from 'react';
import ImageBadge from '../payment-image';

export const getPaymentStatusLabel = (code) => {
    switch (code) {
        case 'SUC':
        case 'PYD':
            // return "Success";
            return "Paid";
        case 'ENT':
        case 'UPD':
            // return "Initiated";
            return "Unpaid";
        case 'PEN':
        case 'REQ':
            return "Pending";
        case 'FAL':
            return "Failed";
        case 'CAN':
            return "Cancelled";
        case 'CRE':
            return "Created";
        case 'DEC':
            return "Declined";
        default:
            return  code || "";
    }
}
export const getStatusBadgeClass = (code ) => {
    switch (code){
        case 'SUC': case 'PYD': return "bg-green-100 text-green-800";
        case 'ENT': case 'UPD': return "bg-neutral-600 text-white";
        case 'PEN': case 'REQ': return "bg-amber-500 text-amber-50";
        case 'CRE': return "bg-indigo-100 text-indigo-800";
        case 'CAN': case 'DEC': return "bg-yellow-100 text-yellow-800";
        case 'FAL': return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
    }
}

export const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'GBP': return '£';
        default: return currencyCode;
    }
}

export const getPaymentIcon = (paymentMethod) => {
    switch (paymentMethod) {
        case 'STRIPE': return <ImageBadge width={25} height={20} image="/stripe.png" />;
        case 'PAYPAL': return <ImageBadge width={25} height={20} image="/paypal.png" />;
        case null: return null;
        default: return <ImageBadge width={25} height={20} image="/stripe.png" />;
    }
}