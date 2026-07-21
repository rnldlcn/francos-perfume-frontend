import { API_URL } from "../config/index.js";

const BASE_URL = `${API_URL}/Transaction`;

export const getAllTransactions = async (filter, token) => {
    const cleanFilter = Object.fromEntries(
        Object.entries(filter).filter(([, v]) => v !== '' && v !== null)
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