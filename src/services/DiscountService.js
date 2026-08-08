import { cleanFilters } from "@/utils/formattingUtils.js";

import apiClient from "./apiClient";

const PATH = "/Discount";

export const getAllDiscounts = async (filter) => {
  const cleanedFilter = cleanFilters(filter);
  const response = await apiClient.get(`${PATH}`, { params: cleanedFilter });
  return response.data;
};

export const addNewDiscount = async (dto) => {
    const response = await apiClient.post(`${PATH}/add`, { params: dto});
    return response.data;
}

export const getDiscountDetails = async (id) => {
    const response = await apiClient.get(`${PATH}/${id}`);
    return response.data;
}

export const getDiscountFilters = async () => {
    const response = await apiClient.get(`${PATH}/filters`);
    return response.data;
}