import { useAuth } from "@/auth/UseAuth";
import { getAllTransactions } from "@/services/transactionService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFilter } from "../useFilter";


export const useTransaction = () => {
    const { user } = useAuth();
    const isFirstLoad = useRef(true);

    const [transactions, setTransaction] = useState([]);

    const [asyncState, setAsyncState] = useState({
        isLoading: true,
        isFetching: false,
        error: null,
    });

    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalEntries: 0,
    });


    const { filter, updateFilter, resetFilter } = useFilter({
        search: '',
        fromDate: '',
        toDate: '',
        processedBy: '',
        pageCount: 1,
        pageSize: 10,
    })

    const fetchTransactions = useCallback(() => {
        if (isFirstLoad.current) {
            setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
        } else {
            setAsyncState((prev) => ({ ...prev, isFetching: true, error: null }));
        }

        getAllTransactions(filter, user?.accessToken)
            .then(data => {
                isFirstLoad.current = false;
                setTransaction(data.data);

                setPagination({
                    totalPages: data.totalTransactionPages || 0,
                    totalEntries: data.totalTransactions || 0,
                })
            })
        .catch((err) => {
            setAsyncState((prev) => ({ ...prev, error: err }));
        })
        .finally(() => {
            setAsyncState((prev) => ({ ...prev, isLoading: false, isFetching: false}));
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

    return { 
        transactions, 
        asyncState, 
        pagination, 
        filter,
        fetchTransactions, 
        updateFilter,
    }
}