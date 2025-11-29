export const getPaymentStatusLabel = (code) => {
    switch (code) {
        case 'SUC':
            return "Success";
        case 'ENT':
            return "Initiated";
        case 'PEN':
            return "Pending";
        case 'FAL':
            return "Failed";
        case 'REQ':
            return "Requested";
        case 'CRE':
            return "Created";
        default:
            return  code || "N/A";
    }
}
export const getStatusBadgeClass = (code ) => {
    switch (code){
        case 'SUC': return "bg-green-100 text-green-800";
        case 'ENT': return "bg-neutral-600 text-white";
        case 'PEN': return "bg-amber-500 text-amber-50";
        case 'REQ': return "bg-blue-700 text-blue-100";
        case 'CRE': return "bg-indigo-100 text-indigo-800";
        case 'CAN': return "bg-yellow-100 text-yellow-800";
        case 'FAL': return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
    }
}
