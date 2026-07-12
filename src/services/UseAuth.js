import { useState } from "react";

// FIXED: Added 'employee_id' to the allowed session keys
const SESSION_KEYS = ['email', 'accessToken', 'branchId', 'trueRole', 'activeRole', 'employee_id']

const loadFromSession = () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return null;

    return {
        email: sessionStorage.getItem('email'),
        accessToken: token,
        branchId: sessionStorage.getItem('branchId'),
        trueRole: sessionStorage.getItem('trueRole'),
        activeRole: sessionStorage.getItem('activeRole') || null, 
        employee_id: sessionStorage.getItem('employee_id') // FIXED: Now it actually loads the ID
    }
}

export const UseAuth = () => {
    const [user, setUser] = useState(loadFromSession);

    const login = (userData) => {
        SESSION_KEYS.forEach(key => {
            if (userData[key]) {
                console.log(`Storing ${key} in sessionStorage:`, userData[key]);
                sessionStorage.setItem(key, userData[key]);
            }
        });
        setUser(userData);
    }

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
    }

    const switchRole = (newActiveRole) => {
        sessionStorage.setItem('activeRole', newActiveRole);
        setUser(prev => ({
            ...prev,
            activeRole: newActiveRole
        }));
    }

    return { user, login, logout, switchRole };
}