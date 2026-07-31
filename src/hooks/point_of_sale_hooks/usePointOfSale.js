import { getAllProductsPOS } from "@/services/pointOfSaleService";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/UseAuth";

export const usePointOfSale = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filter, setFilter] = useState({
        search: '',
        product_type: '',
        product_gender: '',
    })

    useEffect(() => {
        getAllProductsPOS(filter, user?.accessToken)
            .then(response => setProducts(response.data))
            .catch(setError)
            .finally(() => setIsLoading(false));
    }, [filter, user]);

    const updateFilter = (key, value) =>  {
        setFilter(prev => {
            if (key !== 'page') {
                return { ...prev, [key]: value, page: 1 };
            }
            return { ...prev, [key]: value };
        });
    };
        
    return { products, isLoading, error, filter, updateFilter };
}