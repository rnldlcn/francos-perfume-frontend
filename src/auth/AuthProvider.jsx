import { useState } from "react";
import { AuthContext } from "./AuthContext";

const SESSION_KEYS = ['email', 'accessToken', 'branchId', 'trueRole', 'activeRole']

const loadFromSession = () => {
    // can add localStorage instead of sessionStorage
    const token = sessionStorage.getItem('accessToken');
    if (!token) return null;

    return {
        email: sessionStorage.getItem('email'),
        accessToken: token,
        branchId: sessionStorage.getItem('branchId'),
        trueRole: sessionStorage.getItem('trueRole'),
        activeRole: sessionStorage.getItem('activeRole')
    }
};


export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(loadFromSession);

    const login = (userData) => {
        SESSION_KEYS.forEach(key => {
            if (userData[key]) {
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
        const newRole = user.activeRole === 'manager' 
        ? 'cashier' 
        : 'manager';
        
        sessionStorage.setItem('activeRole', newRole);
        setUser(prev => ({
            ...prev,
            activeRole: newRole
        }));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, switchRole, handleSwitchAccess }}>
            {children}
        </AuthContext.Provider>
    );
}


