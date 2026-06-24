import { API_URL } from "../config/index.js";

const BASE_URL = `${API_URL}/pos`;

export const getAllProductsPOS = async (filter, token) => {
    const params = new URLSearchParams(filter);
    const response = await fetch(`${BASE_URL}/products?${params}`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export const checkout = async (checkoutData, token) => {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(checkoutData)
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}