import { useAuth } from "@/auth/UseAuth";
import { getAllAuditLogs } from "@/services/auditLogService";
import { useCallback, useEffect, useRef, useState } from "react";

export const useAuditLog = () => {
    const { user } = useAuth();
    const [auditLogs, setAuditLogs] = useState([]);
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
        module: '',
        pageCount: 1,
        pageSize: 10,
    })

    const fetchAuditLogs = useCallback(() => {
        if (isFirstLoad.current) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }

        getAllAuditLogs(filter, user?.accessToken)
            .then(data => {
                isFirstLoad.current = false;
                console.log(data.data);
                setAuditLogs(data.data);
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
            fetchAuditLogs();
        }, 0);
        return () => clearTimeout(timer); 
    }, [fetchAuditLogs, user?.accessToken])

    const updateFilter = (key, value) =>  {
        setFilter(prev => {
            if (key !== 'page') {
                return { ...prev, [key]: value, pageCount: 1 };
            }
            return { ...prev, [key]: value };
        });
    };

    return { auditLogs, isLoading, filter, totalPages, totalEntries, fetchAuditLogs, updateFilter };
}
