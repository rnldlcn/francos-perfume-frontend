import { useAuth } from "@/auth/UseAuth";
import { getAllProducts } from "@/services/productService";
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

    const { filter, updateFilter, resetFilter } = useFilter({
        search: '',
        fromDate: '',
        toDate: '',
        branch: '',
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

            console.log(data);

            setProducts(data);

            setPagination({
                totalPages: data.totalInventoriesPages || 0,
                totalEntries: data.totalInventories || 0,
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

        
    return { 
      products, 
      asyncState,
      pagination,
      filter,
      updateFilter
    };
}