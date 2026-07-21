import { useAuth } from "@/auth/UseAuth";
import { getAllArchivedAccounts } from "@/services/archiveService";
import { useCallback, useEffect, useRef, useState } from "react";

export const useAccountArchive = () => {
    const { user } = useAuth();
    const [archivedAccounts, setArchivedAccounts] = useState([]);
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
        role: '',
        branch: '',
        pageCount: 1,
        pageSize: 10,
    })

    const fetchArchivedAccounts = useCallback(() => {
        if (isFirstLoad.current) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }

        getAllArchivedAccounts(filter, user?.accessToken)
            .then(data => {
                isFirstLoad.current = false;
                setArchivedAccounts(data.data);
                setTotalPages(data.totalAccountsPages);
                setTotalEntries(data.totalAccounts);
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
            fetchArchivedAccounts();
        }, 0);
        return () => clearTimeout(timer); 
    }, [fetchArchivedAccounts, user?.accessToken])

    const updateFilter = (key, value) =>  {
        setFilter(prev => {
            if (key !== 'page') {
              return { ...prev, [key]: value, pageCount: 1 };
            }
            return { ...prev, [key]: value };
        });
    };

    return { archivedAccounts, isLoading, filter, totalPages, totalEntries, fetchArchivedAccounts, updateFilter };
}
