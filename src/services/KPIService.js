import apiClient from "./ApiClient";

const PATH = "/KPI";
export const getLowStockKPI = async () => {
    const response = await apiClient.get(`${PATH}/inventory`);
    return response.data;
};
