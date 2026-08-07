import { useAuth } from "@/auth/UseAuth";
import { getAllProducts, getProductFilters } from "@/services/productService";
import { buildFilterOptions } from "@/utils/formattingUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFilter } from "../useFilter";

export const useProduct = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
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
        productType: [],
        productGender: [],
    });

    const PRODUCT_FILTER_SCHEMA = [
        { key: "productType", label: "Filter: Type", allLabel: "All Types" },
        { key: "productGender", label: "Filter: Gender", allLabel: "All Gender" },
    ]

    const { filter, updateFilter, resetFilter } = useFilter({
        search: '',
        fromDate: '',
        toDate: '',
        productType: '',
        productGender: '',
        pageCount: 1,
        pageSize: 10,
    });

    const fetchProducts = useCallback(() => {
      if (isFirstLoad.current) {
        setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
      } else {
        setAsyncState((prev) => ({ ...prev, isFetching: true, error: null }));
      }

      getAllProducts(filter, user?.accessToken)
        .then(data => {
            isFirstLoad.current = false;
            
            setProducts(data.data);
            setPagination({
                totalPages: data.totalProductsPages || 0,
                totalEntries: data.totalProducts || 0,
            });
        })
        .catch((err) => {
            setAsyncState((prev) => ({ ...prev, error: err }));
        })
        .finally(() => {
            setAsyncState((prev) => ({ ...prev, isLoading: false, isFetching: false}));
        });

    }, [filter, user?.accessToken]);

    useEffect(() => {
    if (!user?.accessToken) {
        return;
    }
    const timer = setTimeout(() => {
        fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
    }, [fetchProducts, user?.accessToken]);

    const fetchFilters = useCallback(async () => {
        setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const data = await getProductFilters();
            setFilterOptions(buildFilterOptions(data, PRODUCT_FILTER_SCHEMA));
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, error: err }));
        } finally {
            setAsyncState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        fetchFilters();
    }, [fetchFilters]);


        
    return { 
      products, 
      asyncState,
      pagination,
      filter,
      updateFilter,
      filterOptions
    };
}