import { useAuth } from "@/auth/UseAuth";
import { login } from "@/services/loginService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const { login: setUserLogin, onLogin } = useAuth();

    const navigate = useNavigate();

    const [view, setView] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [trueRole, setTrueRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const displayName = email ? email.split('@')[0] : 'User';

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const result = await login(email, password);
            const normalizedRole = result.role;
            setTrueRole(normalizedRole);

            if (normalizedRole === 'MANAGER') {
                setView('module');
            } else {
                setUserLogin({
                    email: result.email,
                    accessToken: result.accessToken,
                    trueRole: normalizedRole,
                    activeRole: normalizedRole,
                    branchId: result.branchId
                });
                navigateByRole(normalizedRole);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleModuleSelect = (module) => {
        onLogin({
            email,
            accessToken: sessionStorage.getItem('accessToken'),
            trueRole,
            activeRole: module,
            branchId: sessionStorage.getItem('branchId')
        });
        navigateByRole(module === 'CASHIER' ? '/pos' : '/home');
    };

    const navigateByRole = (role) => {
        if (role === 'CASHIER') navigate('/pos');
        else if (role === 'OWNER' || role === 'ADMIN') navigate('/');
        else navigate('/home');
    };


    return {
        error,
        isLoading,
        displayName, 
        handleLogin, handleModuleSelect,
        view, setView, 
        password, setPassword,
        email, setEmail,
    }
}