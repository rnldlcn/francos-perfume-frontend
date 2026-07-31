import { cleanFilters } from "@/utils/filterUtils.js";
import apiClient from "./apiClient";

const PATH = "/Transaction";

export const getAllTransactions = async (filter) => {
  const cleanedFilter = cleanFilters(filter);
  const response = await apiClient.get(`${PATH}`, {
    params: cleanedFilter,
  });
  return response.data;
};