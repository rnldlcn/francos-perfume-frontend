import { cleanFilters } from "@/utils/filterUtils.js";

import apiClient from "./apiClient";

const PATH = "/Product";

export const getAllProducts = async (filter) => {
  const cleanedFilter = cleanFilters(filter);
  const response = await apiClient.get(`${PATH}`, { params: cleanedFilter });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await apiClient.get(`${PATH}/${id}`);
  return response.data;
};

export const addNewProduct = async (dto) => {
  const response = await apiClient.post(`${PATH}`, dto);
  return response.data;
};

export const updateProductDetails = async (id, dto) => {
  const response = await apiClient.patch(`${PATH}/update/${id}`, dto);
  return response.data;
};

export const getProductFilters = async () => {
  const response = await apiClient.get(`${PATH}/filters`);
  return response.data;
};