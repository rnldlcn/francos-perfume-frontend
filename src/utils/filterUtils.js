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