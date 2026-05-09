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
    }
};