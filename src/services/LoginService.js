import apiClient from "./ApiClient";

const PATH = "/auth";

export const login = async (email, password) => {
  const response = await apiClient.post(`${PATH}/login`, { email, password });
  return response.data;
};