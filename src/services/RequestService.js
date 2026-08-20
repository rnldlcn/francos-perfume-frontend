import { cleanFilters } from "@/utils/formattingUtils.js";
import apiClient from "./apiClient";

const PATH = "/request";

export const getAllRequests = async (filter = {}) => {
  const cleanedFilter = cleanFilters(filter);
  const response = await apiClient.get(PATH, { params: cleanedFilter });
  return response.data;
};

export const getRequestDetails = async (id) => {
  const response = await apiClient.get(`${PATH}/${id}`);
  return response.data;
};

export const createRequest = async (payload) => {
  const response = await apiClient.post(PATH, payload);
  return response.data;
};

export const approveRequest = async (requestId, remarks = "") => {
  const response = await apiClient.patch(`${PATH}/${requestId}/approve`, {
    remarks,
  });
  return response.data;
};

export const rejectRequest = async (requestId, remarks = "") => {
  const response = await apiClient.patch(`${PATH}/${requestId}/reject`, {
    remarks,
  });
  return response.data;
};

export const getRequestFilters = async () => {
  const response = await apiClient.get(`${PATH}/filters`);
  return response.data;
};