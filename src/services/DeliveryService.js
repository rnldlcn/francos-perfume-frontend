const API_BASE_URL = 'http://localhost:5000/api/Deliveries';

const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = `Server Error (${response.status})`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } catch {
            errorMessage = "A validation or server error occurred.";
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const DeliveryService = {
    dispatchRequest: async (requestId) => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/${requestId}/dispatch`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // 🔧 UPDATED: Now accepts a payload containing quantities and remarks
    receiveRequest: async (requestId, payload) => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/${requestId}/receive`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    }
};