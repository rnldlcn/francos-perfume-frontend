
export const formatLabel = (str) => {
    if (!str) return "";
    return str.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

export const cleanFilters = (filters) => {
    const clean = {};
    Object.keys(filters).forEach((key) => {
        const val = filters[key];
        if (val !== null && val !== undefined && val !== "" && !Number.isNaN(val)) {
        clean[key] = val;
        }
    });
    return clean;
};

export const buildFilterOptions = (rawFilters = {}, schema = []) => {
    return schema.map(({ key, label, allLabel }) => {
        const rawItems = rawFilters[key] || [];
        const itemOptions = rawItems.map((item) => ({
        label: formatLabel(String(item)),
        value: item,
        }));

        return {
        key,
        label,
        options: [
            { label: allLabel || `All ${label.replace("Filter: ", "")}s`, value: "" },
            ...itemOptions,
        ],
        };
    });
};

export const formatDateForTable = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toISOString().split('T')[0];
};

export const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0]; 
};

export const formatDateTimeForTable = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const datePart = date.toISOString().split('T')[0];
    const timePart = date.toLocaleString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    return `${datePart}, ${timePart}`;
};

