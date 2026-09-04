import { forecastRevenue, forecastStocks, forecastStocksAI } from "@/services/ForecastService";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useForecast
 * ─────────────────
 * Wraps the three /api/Forecasting endpoints:
 *   - POST /stocks  → stock forecast  (StockForecastRequestDTO)
 *   - POST /revenue → revenue forecast (RevenueForecastRequestDTO)
 *   - POST /ai      → AI stock forecast (StockForecastRequestDTO)
 *
 * Both request DTOs only need Year + Month, so the caller passes a single
 * `{ year, month }` (and optionally discount params for revenue, and a
 * productId for the stock endpoints) and the hook fans it out.
 */

/** @typedef {{ year: number, month: number, productId?: number, discountPercent?: number, discountAmount?: number, hasDiscount?: boolean, isPercentageDiscount?: boolean }} ForecastRequestDTO */

const buildStockRequest = ({ year, month, productId }) => ({ year, month, productId });
const buildRevenueRequest = ({ year, month, discountPercent, discountAmount, hasDiscount, isPercentageDiscount }) => ({
    year,
    month,
    discountPercent,
    discountAmount,
    hasDiscount,
    isPercentageDiscount,
});

export const useForecast = () => {
    const isFirstLoad = useRef(true);

    const [asyncState, setAsyncState] = useState({
        isLoading: true,
        isFetching: false,
        error: null,
    });

    // Combined forecast result from the backend
    const [forecastData, setForecastData] = useState({
        stocks: null,
        revenue: null,
        ai: null,
    });

    /**
     * @param {ForecastRequestDTO} dto
     */
    const fetchForecast = useCallback(async (dto) => {
        if (isFirstLoad.current) {
            setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
        } else {
            setAsyncState((prev) => ({ ...prev, isFetching: true, error: null }));
        }

        try {
            const [stocks, revenue, ai] = await Promise.all([
                forecastStocks(buildStockRequest(dto)),
                forecastRevenue(buildRevenueRequest(dto)),
                forecastStocksAI(buildStockRequest(dto)),
            ]);

            isFirstLoad.current = false;
            setForecastData({ stocks, revenue, ai });
            return { stocks, revenue, ai };
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, error: err }));
            throw err;
        } finally {
            setAsyncState((prev) => ({ ...prev, isLoading: false, isFetching: false }));
        }
    }, []);

    useEffect(() => {
        const now = new Date();
        fetchForecast({
            year: now.getFullYear(),
            month: now.getMonth() + 1, // 1-indexed to match the backend
            productId: 0,
            discountPercent: 0,
            discountAmount: 0,
            hasDiscount: false,
            isPercentageDiscount: false,
        }).catch(() => { /* surfaced via asyncState.error */ });
    }, [fetchForecast]);

    return {
        forecastData,
        asyncState,
        fetchForecast,
    };
};