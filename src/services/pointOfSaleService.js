import { API_URL } from "../config/index.js";

const BASE_URL = `${API_URL}/pos`;

export const getAllProductsPOS = async (filter, token) => {
    const cleanFilter = Object.fromEntries(
        Object.entries(filter)
        .filter(([, v]) => v !== '' && v !== null && v !== 'ALL')
        .map(([k, v]) => [k, typeof v === 'string' 
            ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
            : v
        ])                                                    
    );
    const params = new URLSearchParams(cleanFilter);
    const response = await fetch(`${BASE_URL}?${params}`, {
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
    const response = await fetch(`${BASE_URL}/checkout`, {
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