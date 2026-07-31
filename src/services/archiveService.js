import { cleanFilters } from "@/utils/filterUtils.js";

import apiClient from "./apiClient";

const PATH = "/Archiving";

export const getAllArchivedAccounts = async (filter) => {
  const cleanedFilter = cleanFilters(filter);
  const response = await apiClient.get(`${PATH}/account`, {
    params: cleanedFilter,
  });
  return response.data;
};

export const getAllArchivedProducts = async (filter) => {
  const cleanedFilter = cleanFilters(filter);
  const response = await apiClient.get(`${PATH}/product`, {
    params: cleanedFilter,
  });
  return response.data;
};

export const archiveAccount = async (id) => {
  const response = await apiClient.patch(`${PATH}/account/${id}`);
  return response.data;
};

export const archiveProduct = async (id) => {
  const response = await apiClient.patch(`${PATH}/product/${id}`);
  return response.data;
};