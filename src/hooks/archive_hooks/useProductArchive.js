import { useAuth } from "@/auth/UseAuth";
import { getAllArchivedProducts } from "@/services/archiveService";
import { useCallback, useEffect, useRef, useState } from "react";

export const useProductArchive = () => {
    const { user } = useAuth();
    const [archivedProducts, setArchivedProducts] = useState([]);
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

    const fetchArchivedProducts = useCallback(() => {
        if (isFirstLoad.current) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }

        getAllArchivedProducts(filter, user?.accessToken)
            .then(data => {
                isFirstLoad.current = false;
                console.log(data);
                console.log(data.data);
                setArchivedProducts(data.data);
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
            fetchArchivedProducts();
        }, 0);
        return () => clearTimeout(timer); 
    }, [fetchArchivedProducts, user?.accessToken])

    const updateFilter = (key, value) =>  {
        setFilter(prev => {
            if (key !== 'page') {
              return { ...prev, [key]: value, pageCount: 1 };
            }
            return { ...prev, [key]: value };
        });
    };

    return { archivedProducts, isLoading, filter, totalPages, totalEntries, fetchArchivedProducts, updateFilter };
}
