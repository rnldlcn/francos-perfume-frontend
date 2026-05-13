const API_URL = "http://localhost:5000/api"


export const fetchAllInventory = async (token) => {
    // 🔧 FIXED: Added ?pageSize=500 to pull all inventory records instantly
    const response = await fetch(`${API_URL}/Inventory/displayAll?pageSize=500`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        }
    });
    if (!response.ok) throw new Error(await response.text());

    return await response.json();
}

export const updateQuantity = async (itemId, newQuantity, token) => {
    const response = await fetch(`${API_URL}/inventory/updateQuantity/${itemId}?qty=${newQuantity}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
    });

    
    //console.log("API Response:", response);
    if (!response.ok) throw new Error(await response.text());

    return await response.json();
}

export const updateStock = async () => {

}