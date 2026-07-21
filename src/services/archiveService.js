import { cleanFilters } from "@/utils/filterUtils.js";
import { API_URL } from "../config/index.js";

const BASE_URL = `${API_URL}/Archiving`;

export const getAllArchivedAccounts = async (filter, token) => {
    const cleanedFilter = cleanFilters(filter);

    const params = new URLSearchParams(cleanedFilter);
    const response = await fetch(`${BASE_URL}/account?${params}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export const getAllArchivedProducts = async (filter, token) => {
    const cleanedFilter = cleanFilters(filter);

    const params = new URLSearchParams(cleanedFilter);
    const response = await fetch(`${BASE_URL}/product?${params}`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}
