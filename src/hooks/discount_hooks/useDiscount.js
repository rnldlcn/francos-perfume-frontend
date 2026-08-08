import { useAuth } from "@/auth/UseAuth";
import { addNewDiscount, getAllDiscounts, getDiscountFilters } from "@/services/discountService";
import { buildFilterOptions } from "@/utils/formattingUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFilter } from "../useFilter";

export const useDiscounts = () => {
    const { user } = useAuth();
    const [discounts, setDiscounts] = useState([]);
    const isFirstLoad = useRef(true);
    
    // can add the page and page size here
    const [asyncState, setAsyncState] = useState({
        isLoading: true,
        isFetching: false,
        error: null,
    });

    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalEntries: 0,
    });

    const [filterOptions, setFilterOptions] = useState({
        discountStatus: [],
    });

    const DISCOUNT_FILTER_SCHEMA = [
        { key: "discountStatus", label: "Filter: Status", allLabel: "All Status" },
    ]

    const { filter, updateFilter, resetFilter } = useFilter({
        search: '',
        fromDate: '',
        toDate: '',
        discountStatus: '',
        pageCount: 1,
        pageSize: 10,
    });

    const fetchAllDiscounts = useCallback(() => {
      if (isFirstLoad.current) {
        setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
      } else {
        setAsyncState((prev) => ({ ...prev, isFetching: true, error: null }));
      }

      getAllDiscounts(filter)
        .then(data => {
            isFirstLoad.current = false;
            setDiscounts(data.data);
            setPagination({
                totalPages: data.totalDiscountPages || 0,
                totalEntries: data.totalDiscounts || 0,
            });
        })
        .catch((err) => {
            setAsyncState((prev) => ({ ...prev, error: err }));
        })
        .finally(() => {
            setAsyncState((prev) => ({ ...prev, isLoading: false, isFetching: false}));
        });

    }, [filter]);

    useEffect(() => {
    const timer = setTimeout(() => {
        fetchAllDiscounts();
    }, 0);
    return () => clearTimeout(timer);
    }, [fetchAllDiscounts]);

    const getDiscount = async (id) => {
        try {
            const data = getDiscount(id);
            return data;
        } catch (err) {
            setAsyncState({ error: err })
        }
    }

    /*
    NO ENDPOINT EXISTS FOR UPDATING DISCOUNT AT THE MOMENT.
    const updateDiscount = async (id, dto) => {
        try {
            const data = updateDiscountDetails(id, dto);
            fetchAllProducts();
            return data;
        } catch (err) {
            setAsyncState({ error: err })
        }
    }
    */

    const createDiscount = async (dto) => {
        try {
            const data = await addNewDiscount(dto);
            await fetchAllDiscounts();
            return data;
        } catch (err) {
            setAsyncState({ error: err })
        }
    }

    const fetchDiscountFilters = useCallback(async () => {
        setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const data = await getDiscountFilters();
            setFilterOptions(buildFilterOptions(data, DISCOUNT_FILTER_SCHEMA));
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, error: err }));
        } finally {
            setAsyncState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        fetchDiscountFilters();
    }, [fetchDiscountFilters]);

        
    return { 
      discounts, 
      asyncState,
      pagination,
      filter,
      updateFilter,
      filterOptions,
    };
}