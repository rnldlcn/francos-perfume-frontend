import { cleanFilters } from "@/utils/filterUtils.js";
import apiClient from "./apiClient";

const PATH = "/AuditLog";

export const getAllAuditLogs = async (filter) => {
  const cleanedFilter = cleanFilters(filter);
  const response = await apiClient.get(`${PATH}`, {
    params: cleanedFilter,
  });
  return response.data;
};