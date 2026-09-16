import { getLowStockKPI } from "@/services/KPIService";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useKPI
 * ──────
 * Wraps the /api/KPI endpoints. Currently exposes a single
 * "low stock" KPI for the current user/branch.
 */
export const useKPI = () => {
    const isFirstLoad = useRef(true);

    const [asyncState, setAsyncState] = useState({
        isLoading: true,
        isFetching: false,
        error: null,
    });

    const [lowStock, setLowStock] = useState(null);

    const fetchLowStock = useCallback(async () => {
        if (isFirstLoad.current) {
            setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
        } else {
            setAsyncState((prev) => ({ ...prev, isFetching: true, error: null }));
        }

        try {
            const data = await getLowStockKPI();
            isFirstLoad.current = false;
            setLowStock(data);
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, error: err }));
        } finally {
            setAsyncState((prev) => ({ ...prev, isLoading: false, isFetching: false }));
        }
    }, []);

    useEffect(() => {
        fetchLowStock();
    }, [fetchLowStock]);

    return {
        lowStock,
        asyncState,
        fetchLowStock,
    };
};
