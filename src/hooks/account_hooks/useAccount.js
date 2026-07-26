import { useAuth } from "@/auth/UseAuth";
import { addNewAccount, getAccount, getAllAccounts, updateAccountDetails } from "@/services/accountService";
import { useCallback, useEffect, useRef, useState } from "react";

export const useAccount = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false); 
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEntries, setTotalEntries] = useState(1);
    const isFirstLoad = useRef(true);

    const [filter, setFilter] = useState({
        search: '',
        fromDate: '',
        toDate: '',
        branch: '',
        status: '',
        role: '',
        pageCount: 1,
        pageSize: 10,
    });

    const fetchAllAccounts = useCallback(() => {
        if (isFirstLoad.current) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }

        getAllAccounts(filter, user?.accessToken)
            .then(data => {
                isFirstLoad.current = false;
                setAccounts(data.data);
                setTotalPages(data.totalAuditPages);
                setTotalEntries(data.totalAuditLogs);
            })
            .catch(setError)
            .finally(() => {
                setIsLoading(false);
                setIsFetching(false);
            });

    }, [filter, user?.accessToken]);

    useEffect(() => {
        if (!user?.accessToken) {
            return;
        }
        const timer = setTimeout(() => {
            fetchAllAccounts();
        }, 0);
        return () => clearTimeout(timer); 
    }, [fetchAllAccounts, user?.accessToken])

    const fetchAccount = useCallback(async (employeeId, token) => {
        try {
            const data = getAccount(employeeId, token);
            return data;
        } catch (error) {
            setError(error);
        }
    }, [])

    const updateDetails = async (dto, token) => {
        try {
            const data = updateAccountDetails(dto, token);
            fetchAllAccounts();
            return data;
        } catch (error) {
            setError(error);
        }
    };

    const addAccount = async (dto, token) => {
        try {
            const data = addNewAccount(dto, token);
            fetchAllAccounts();
            return data;
        } catch (error) {
            setError(error);
        }
    };

    const updatePassword = async (employeeId) => {

    };

    const resetPassword = async (employeeId) => {

    };

    const updateAuth = () => {

    };

    const deactivate = () => {

    };

    const updateFilter = (key, value) =>  {
        setFilter(prev => {
            if (key !== 'page') {
                return { ...prev, [key]: value, pageCount: 1 };
            }
            return { ...prev, [key]: value };
        });
    };

    return { accounts, isLoading, filter, error, totalPages, totalEntries, fetchAccount, fetchAllAccounts };
}