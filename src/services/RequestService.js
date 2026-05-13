const API_BASE_URL = 'http://localhost:5000/api/request';

// Helper function to extract the REAL error message safely
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = `Server Error (${response.status})`;
        
        // We use a single attempt to read the body
        try {
            const errorData = await response.json();
            // Dig into the ASP.NET 'errors' object if it exists (for 400 Bad Requests)
            if (errorData.errors) {
                errorMessage = Object.values(errorData.errors).flat().join(', ');
            } else {
                errorMessage = errorData.message || errorData.title || JSON.stringify(errorData);
            }
        } catch {
            // If JSON parsing fails, we cannot read 'response' again directly.
            // In most cases, a 400/500 error will be JSON.
            errorMessage = "A validation or server error occurred.";
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const RequestService = {
    
    getAllRequests: async () => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/displayAll`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response);
    },

    getRequestDetails: async (id) => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/displayOne/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response);
    },

    createRequest: async (payload) => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    approveRequest: async (requestId, remarks) => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/${requestId}/approve`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ remarks: remarks || "" }) // Ensures remarks is always sent
        });
        return handleResponse(response);
    },

    rejectRequest: async (requestId, remarks) => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/${requestId}/reject`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ remarks: remarks || "" }) // Ensures remarks is always sent
        });
        return handleResponse(response);
    }
};