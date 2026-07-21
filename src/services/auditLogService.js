import { cleanFilters } from "@/utils/filterUtils.js";
import { API_URL } from "../config/index.js";

const BASE_URL = `${API_URL}/AuditLog`;

export const getAllAuditLogs = async (filter, token) => {
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