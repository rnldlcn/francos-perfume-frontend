import { useState } from "react";
import { AuthContext } from "./AuthContext";

const SESSION_KEYS = ['email', 'accessToken', 'branchId', 'trueRole', 'activeRole']

const loadFromSession = () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return null;

    return {
        email: sessionStorage.getItem('email'),
        accessToken: token,
        branchId: sessionStorage.getItem('branchId'),
        trueRole: sessionStorage.getItem('trueRole'),
        activeRole: sessionStorage.getItem('activeRole') || null, 
    }
};



export const AuthProvider = ({ children }) => {
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

    const handleSwitchAccess = () => {
        setUser(prev => {
            const newRole = prev.activeRole === 'manager' 
            ? 'cashier' 
            : 'manager';
            
            sessionStorage.setItem('activeRole', newRole);
            return {
                ...prev,
                activeRole: newRole
            };
        })
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, switchRole, handleSwitchAccess }}>
            {children}
        </AuthContext.Provider>
    );
}


