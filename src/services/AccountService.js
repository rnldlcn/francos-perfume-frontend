import { cleanFilters } from "@/utils/filterUtils.js";
import { API_URL } from "../config/index.js";

const BASE_URL = `${API_URL}/Account`;

export const getAllAccounts = async (filter, token) => {
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
};


export const getAccount = async (id, token) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
};

export const addNewAccount = async (dto, token) => {
    const response = await fetch(`${BASE_URL}`, {
        method:'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
    });

    if (!response.ok) throw new Error(await response.json());
    return response.json();
};

export const updateAccountDetails = async (id, dto, token) => {
    const response = await fetch(`${BASE_URL}/update/${id}`, {
        method:'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
    });

    if (!response.ok) throw new Error(await response.json());
    return response.json();
};

export const updateAccountPassword = async (id, dto, token) => {
    const response = await fetch(`${BASE_URL}/update/password/${id}`, {
        method:'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
    });

    if (!response.ok) throw new Error(await response.json());
    return response.json();
};

export const resetAccountPassword = async (id, token) => {
    const response = await fetch(`${BASE_URL}/reset/password/${id}`,{
        method:'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error(await response.json());
    return response.json();
};

export const updateAccountAuth = async (id, dto, token) => {
    const response = await fetch(`${BASE_URL}/update/auth/${id}`,{
        method:'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
    });

    if (!response.ok) throw new Error(await response.json());
    return response.json();
};


export const deactivateAccount = async (id, token) => {
    const response = await fetch(`${BASE_URL}/deactivate/${id}`,{
        method:'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error(await response.json());
    return response.json();
};

