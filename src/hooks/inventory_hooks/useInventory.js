import { useAuth } from "@/auth/UseAuth";
import { getAllInventory, getInventoryBatches, updateBatch } from "@/services/inventoryService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFilter } from "../useFilter";

export const useInventory = () => {
    const { user } = useAuth();
    const [inventory, setInventory] = useState([]);
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

    const fetchInventory = useCallback(() => {
      if (isFirstLoad.current) {
        setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
      } else {
        setAsyncState((prev) => ({ ...prev, isFetching: true, error: null }));
      }

      getAllInventory(filter, user?.accessToken)
        .then(data => {
          isFirstLoad.current = false;

          setInventory(data.data);

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
        fetchInventory();
      }, 0);
      return () => clearTimeout(timer);
    }, [fetchInventory, user?.accessToken]);

    const saveBatchEdit = async (submittedBatchData) => {
      try {
        await updateBatch(submittedBatchData.batchId, 
          {
          productId: submittedBatchData.productId,
          quantity: submittedBatchData.quantity,
          expiryDate: submittedBatchData.targetDate,
          reason: submittedBatchData.reason
          }, user?.accessToken);
      } catch (err) {
       setAsyncState((prev) => ({ ...prev, error: err }));
      }
    }

    const fetchBatchesForProduct = async (productId, branchId) => {
      try {
        const data = await getInventoryBatches(productId, branchId, user?.accessToken);
        return data.batches;
      } catch (err) {
        setAsyncState((prev) => ({ ...prev, error: err }));;
        return null;
      }
    };


    return { 
      inventory, 
      asyncState,
      pagination,
      filter, 
      fetchBatchesForProduct, 
      saveBatchEdit, 
      updateFilter
    };
};