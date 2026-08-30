import { cleanFilters } from "@/utils/formattingUtils.jsx";

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
  const response = await apiClient.patch(`${PATH}/account/archive/${id}`);
  return response.data;
};

export const archiveProduct = async (id) => {
  const response = await apiClient.patch(`${PATH}/product/archive/${id}`);
  return response.data;
};