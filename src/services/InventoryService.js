import { API_URL } from "../config/index.js";

const BASE_URL = `${API_URL}/inventory`;

export const getAllInventory = async (filter, token) => {
    //testing to see whether filter returns a string
    console.log("Fetching inventory with filter:", filter);

    const params = new URLSearchParams(filter);
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

export const getInventoryBatches = async (productId, token) => {
    const response = await fetch(`${BASE_URL}/${productId}/batches`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export const updateQuantity = async (productId, quantity, token) => {
    // testing to see whether productId and quantity are being passed correctly
    console.log(`Updating product ${productId} with quantity ${quantity}`);
    const response = await fetch(`${BASE_URL}/${productId}/quantity?inserted_qty=${quantity}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}


/*
 *  I don't know what is this for to be honest, but it's one of the controllers in the backend.
 */ 
export const addInventoryItem = async () => {
    
}
