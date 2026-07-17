import { cleanFilters } from "@/utils/filterUtils.js";
import { API_URL } from "../config/index.js";

const BASE_URL = `${API_URL}/Inventory`;

export const getAllInventory = async (filter, token) => {
    const cleanedFilter = cleanFilters(filter);

    const params = new URLSearchParams(cleanedFilter);
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

export const getInventoryBatches = async (productId, branchId, token) => {
    const params = new URLSearchParams();
    params.append('branchId', branchId);
    params.append('productId', productId);
    const response = await fetch(`${BASE_URL}/batch?${params}`, {
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
    const response = await fetch(`${BASE_URL}/batch/${batchId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product_id: dto.productId,
            quantity: dto.quantity,
            expiry_date: dto.targetDate,
            reason: dto.reason
        })
    });
    if (!response.ok) throw new Error(await response.text());
    console.log(await response.json());
    return await response.json();
}


/*
 *  I don't know what is this for to be honest, but it's one of the controllers in the backend.
 */ 
export const addInventoryItem = async () => {
    
}
