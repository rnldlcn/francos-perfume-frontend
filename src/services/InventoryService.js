const API_URL = "http://localhost:5000/api"

export const fetchAllInventory = async (token) => {
<<<<<<< HEAD
    const response = await fetch(`${API_URL}/inventory/displayAll`, {
=======
    // 🔧 FIXED: Added ?pageSize=500 to pull all inventory records instantly
    const response = await fetch(`${API_URL}/Inventory/displayAll?pageSize=500`, {
>>>>>>> 90de722d2beaa1d92b9d8f14238328e850ec6a97
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        }
    });
<<<<<<< HEAD
=======
    
    //console.log("API Response:", response);
>>>>>>> 90de722d2beaa1d92b9d8f14238328e850ec6a97
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

<<<<<<< HEAD
    if (!response.ok) throw new Error(await response.text());

    return await response.json();
}

export const updateStock = async (restockType) => {
    const response = await fetch(`${API_URL}/Inventory/updateStock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restockType })
    });

    if (!response.ok) throw new Error(await response.text());

    return await response.json();
}

=======
}
>>>>>>> 90de722d2beaa1d92b9d8f14238328e850ec6a97
