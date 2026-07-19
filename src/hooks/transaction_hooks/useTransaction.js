import { useAuth } from "@/auth/useAuth";
import { getAllTransactions } from "@/services/transactionService";
import { useCallback, useEffect, useState } from "react";


export const useTransaction = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEntries, setTotalEntries] = useState(1);

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
        if (totalEntries == 0) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }

        getAllTransactions(filter, user?.accessToken)
            .then(data => {
                setTransaction(data.data);
                setIsLoading(false);
                setIsFetching(false);
            });
    }, [filter, user?.accessToken, totalEntries])

    useEffect(() => {
          if (user?.accessToken) {
            fetchTransactions();
          }
    }, [user?.accessToken, filter, totalEntries]);

    const updateFilter = (key, value) => {
        setFilter(prev => {
            if (key !== 'page') {
              return { ...prev, [key]: value, page: 1 };
            }
            return { ...prev, [key]: value };
        });
    }

    return { transactions, filter, isLoading, totalEntries, totalPages, fetchTransactions, updateFilter}
}