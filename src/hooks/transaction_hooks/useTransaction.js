import { useAuth } from "@/auth/useAuth";
import { getAllTransactions } from "@/services/transactionService";
import { useCallback, useState } from "react";


export const useTransaction = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [totalEntries, setTotalEntries] = useState(1);

    const [filter, setFilter] = useState({
        search: '',
        fromDate: '',
        toDate: '',
        processed_by: '',
        
    })

    const fetchTransactions = useCallback(() => {
        if (totalEntries == 0) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }

        getAllTransactions(filter)
    }, [])
}