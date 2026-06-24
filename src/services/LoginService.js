import { API_URL } from "../config/index.js";

const BASE_URL = `${API_URL}/auth`;

export const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) throw new Error('Invalid Credentials');
    return await response.json();
}