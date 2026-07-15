import { getAllInventory, getInventoryBatches, updateBatch } from "@/services/inventoryService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/useAuth";

export const useInventory = () => {
    const { user } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false); 
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEntries, setTotalEntries] = useState(1);
    const isFirstLoad = useRef(true);
    
    // can add the page and page size here
    const [filter, setFilter] = useState({
        search: '',
        fromDate: '',
        toDate: '',
        productType: '',
        productGender: '',
        branch: '',
        pageCount: 1,
        pageSize: 10,
    })

    const fetchInventory = useCallback(() => {
      if (isFirstLoad.current) {
        setIsLoading(true);
      } else {
        setIsFetching(true);
      }

      getAllInventory(filter, user?.accessToken)
        .then(data => {
          setInventory(data.data);
          setTotalPages(data?.totalInventoriesPages || 1);
          setTotalEntries(data?.totalInventories || 0);
        })
        .catch(setError)
        .finally(() => {
          setIsLoading(false);
          setIsFetching(false);
        });
    }, [filter, user?.accessToken]);

    useEffect(() => {
      if (user?.accessToken) {
        fetchInventory();
      }
    }, [fetchInventory]);

    const refresh = () => fetchInventory();

    const handleSaveBatchEdit = async (updatedBatch) => {
      try {
        await updateBatch(updatedBatch.batchId, {
          productId: updatedBatch.productId,
          quantity: updatedBatch.quantity,
          expiryDate: updatedBatch.targetDate,
          reason: updatedBatch.reason
        }, user?.accessToken);
        refresh();
      } catch (error) {
        setError(error);
      }
    }

    const fetchBatchesForProduct = async (productId, branchId) => {
      try {
        const data = await getInventoryBatches(productId, branchId, user?.accessToken);
        return data.batches;
      } catch (err) {
        setError(err);
        return null;
      }
    };

    const updateFilter = (key, value) =>  {
        setFilter(prev => {
            if (key !== 'page') {
              return { ...prev, [key]: value, page: 1 };
            }
            return { ...prev, [key]: value };
        });
    };
    return { inventory, isLoading, filter, totalPages, totalEntries, error, fetchBatchesForProduct, handleSaveBatchEdit, updateFilter};
};
