import { useState } from 'react';

export const useFilter = (initialFilters = {}) => {

    const defaultPagination = {
        pageCount: 1,
        pageSize: 10
    };

    const [filter, setFilter] = useState({
        ...initialFilters,
        ...defaultPagination
    });

    const updateFilter = (key, value) => {
        setFilter((prev) => {
            if (key !== 'pageCount') {
                return { ...prev, [key]: value, pageCount: 1}
            }
            return { ...prev, [key]: value}
        });
    };

    const setMultipleFilters = (values) => {
        setFilter((prev) => ({
            ...prev,
            ...values,
            pageCount: 1
        }));
    };

    const resetFilter = () => {
        setFilter({
            ...initialFilters,
            ...defaultPagination
        });
    };

    return { filter, setFilter, updateFilter, setMultipleFilters, resetFilter };
}