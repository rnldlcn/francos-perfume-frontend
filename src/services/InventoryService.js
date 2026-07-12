import { API_URL } from "../config/index.js";

const BASE_URL = `${API_URL}/Inventory`;

export const getAllInventory = async (filter, token) => {
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

export const getInventoryItemDetails = async (productId, token) => {
    const response = await fetch(`${BASE_URL}/${productId}`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export const getInventoryBatches = async (productId, branch, token) => {
    const params = new URLSearchParams();
    params.append('branch', branch);
    const response = await fetch(`${BASE_URL}/${productId}/batches?${params}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export const updateBatch = async (batchId, dto, token) => {
    const response = await fetch(`${BASE_URL}/${batchId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}


/*
 *  I don't know what is this for to be honest, but it's one of the controllers in the backend.
 */ 
export const addInventoryItem = async () => {
    
}
