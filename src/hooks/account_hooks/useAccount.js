import { useAuth } from "@/auth/UseAuth";
import { getAllAccounts } from "@/services/accountService";
import { useCallback, useRef, useState } from "react";

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
    })

    const fetchAllAccounts = useCallback(() => {
        if (isFirstLoad.current) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }

        getAllAccounts(filter, user?.accessToken)
            .then(data => {
                isFirstLoad.current = false;
                console.log(data.data);
                setAccounts(data.data);
                setTotalPages(data.totalAuditPages);
                setTotalEntries(data.totalAuditLogs);
            })
            .catch(setError)
            .finally(() => {
                setIsLoading(false);
                setIsFetching(false);
            });

    }, [fetchAllAccounts, user?.accessToken])


    const updateFilter = (key, value) =>  {
        setFilter(prev => {
            if (key !== 'page') {
                return { ...prev, [key]: value, pageCount: 1 };
            }
            return { ...prev, [key]: value };
        });
    };

    return { accounts,  };
}