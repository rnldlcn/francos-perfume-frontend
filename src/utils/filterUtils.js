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

export const formatLabel = (str) =>{
  if (!str) return "";

  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" "); 
}

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