const API_BASE_URL = 'http://localhost:5000/api/products'; 

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

export const ProductService = {
    getAllProducts: async () => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/displayAll`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response);
    },

    addProduct: async (payload) => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    updateProduct: async (id, payload) => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/updateProduct/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    // 🔧 Added the Archive endpoint to support the new button
    archiveProduct: async (id) => {
        const token = sessionStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/archive/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return handleResponse(response);
    }
};