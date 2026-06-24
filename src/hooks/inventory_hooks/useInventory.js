import { useAuth } from "@/context/AuthContext";
import { getAllInventory } from "@/services/inventoryService";
import { useEffect, useState } from "react";

export const useInventory = () => {
    const { user } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filter, setFilter] = useState({
        search: '',

    })

    useEffect(() => {
        getAllInventory(filter, user?.accessToken)
            .then(setInventory)
            .catch(setError)
            .finally(() => setIsLoading(false));

    }, [filter, user]);

    return { inventory, isLoading, error};
};
