import { useAuth } from "@/auth/useAuth";
import { getAllTransactions } from "@/services/transactionService";
import { useCallback, useEffect, useRef, useState } from "react";


export const useTransaction = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEntries, setTotalEntries] = useState(1);
    const [error, setError] = useState(null);
    const isFirstLoad = useRef(true);

    const [transactions, setTransaction] = useState([]);

    const [filter, setFilter] = useState({
        search: '',
        fromDate: '',
        toDate: '',
        processedBy: '',
        pageCount: 1,
        pageSize: 10,
    })

    const fetchTransactions = useCallback(() => {
        if (isFirstLoad.current) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }

        getAllTransactions(filter, user?.accessToken)
            .then(data => {
                isFirstLoad.current = false;
                console.log(data.data);
                setTransaction(data.data);
                setTotalPages(data.totalTransactionPages);
                setTotalEntries(data.totalTransactions);
            })
        .catch(setError)
        .finally(() => {
          setIsLoading(false);
          setIsFetching(false);
        });
    }, [filter, user?.accessToken])

    useEffect(() => {
      if (!user?.accessToken) {
        return;
      }
      const timer = setTimeout(() => {
        fetchTransactions();
      }, 0);
      return () => clearTimeout(timer);
    }, [fetchTransactions, user?.accessToken]);

    const updateFilter = (key, value) => {
        setFilter(prev => {
            if (key !== 'page') {
              return { ...prev, [key]: value, pageCount: 1 };
            }
            return { ...prev, [key]: value };
        });
    }

    return { transactions, filter, isLoading, totalEntries, totalPages, fetchTransactions, updateFilter}
}