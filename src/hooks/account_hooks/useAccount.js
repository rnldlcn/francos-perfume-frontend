import { addNewAccount, getAccount, getAccountFilters, getAllAccounts, resetAccountPassword, toggleAccountStatus, updateAccountDetails } from "@/services/accountService";
import { archiveAccount } from "@/services/archiveService";
import { buildFilterOptions } from "@/utils/filterUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFilter } from "../useFilter";

export const useAccount = () => {
    const [accounts, setAccounts] = useState([]);
    const isFirstLoad = useRef(true);

    const [asyncState, setAsyncState] = useState({
        isLoading: true,
        isFetching: false,
        error: null,
    });

    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalEntries: 0,
    });

    const { filter, updateFilter, resetFilter, setFilter } = useFilter({
        search: '',
        fromDate: '',
        toDate: '',
        branchLocation: '',
        accountStatus: '',
        employeeRole: '',
        pageCount: 1,
        pageSize: 10,
    });

    const [filterOptions, setFilterOptions] = useState({
        accountStatus: [],
        employeeRole: [],
        branchLocation: [],
    });

    const ACCOUNT_FILTER_SCHEMA = [
        { key: "employeeRole", label: "Filter: Role", allLabel: "All Roles" },
        { key: "accountStatus", label: "Filter: Status", allLabel: "All Statuses" },
        { key: "branchLocation", label: "Filter: Branch", allLabel: "All Branches" },
    ]

    const fetchAllAccounts = useCallback(() => {
        if (isFirstLoad.current) {
            setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
        } else {
            setAsyncState((prev) => ({ ...prev, isFetching: true, error: null }));
        }

        getAllAccounts(filter)
            .then(data => {
                isFirstLoad.current = false;
                setAccounts(data.data);
                setPagination({
                    totalPages: data.totalEmployeesPages || 0,
                    totalEntries: data.totalEmployees || 0,
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
            fetchAllAccounts();
        }, 0);
        return () => clearTimeout(timer); 
    }, [fetchAllAccounts])

    const fetchAccount = useCallback(async (employeeId) => {
        try {
            const data = await getAccount(employeeId);
            return data;
        } catch (err) {
            setAsyncState({  error: err });
        }
    }, [])

    const updateDetails = async (id, dto) => {
        try {
            const data = updateAccountDetails(id, dto);
            fetchAllAccounts();
            return data;
        } catch (err) {
            setAsyncState({  error: err });
        }
    };

    const addAccount = async (dto) => {
        try {
            const data = addNewAccount(dto);
            fetchAllAccounts();
            return data;
        } catch (err) {
            setAsyncState({  error: err });
        }
    };

    const updatePassword = async (id) => {
        // TO BE ADDED
    };

    const resetPassword = useCallback(async (id) => {
        try {
            await resetAccountPassword(id);
            fetchAllAccounts();
            setAsyncState((prev) => ({ ...prev, isLoading: false, error: null }));
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, isLoading: false, error: err }));
        } finally {
            setAsyncState((prev) => ({ ...prev, isLoading: false }));
        }
    }, [fetchAllAccounts]);



    const updateAuth = (id) => {
        // TO BE ADDED
    };

    const toggleStatus = useCallback(async (id) => {
        try {
            await toggleAccountStatus(id);
            fetchAllAccounts();
            setAsyncState((prev) => ({ ...prev, isLoading: false, error: null }));
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, isLoading: false, error: err }));
        } finally {
            setAsyncState((prev) => ({ ...prev, isLoading: false }));
        }
    }, [fetchAllAccounts]);

    const archive = useCallback(async (id) => {
        setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            await archiveAccount(id);
            fetchAllAccounts();
            setAsyncState((prev) => ({ ...prev, isLoading: false, error: null }));
        } catch (err) {
            setAsyncState((prev) => ({ ...prev, isLoading: false, error: err }));
        } finally {
            setAsyncState((prev) => ({ ...prev, isLoading: false }));
        }
    }, [fetchAllAccounts]);

    const fetchFilters = useCallback(async () => {
        setAsyncState((prev) => ({ ...prev, isLoading: true, error: null }));
        
        try {
            const data = await getAccountFilters();
            setFilterOptions(buildFilterOptions(data, ACCOUNT_FILTER_SCHEMA));
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
        accounts, 
        asyncState,
        pagination,
        filter,
        updateFilter,
        fetchAccount,
        archive,
        toggleStatus,
        resetPassword,
        filterOptions,
        updateDetails,
    };
}