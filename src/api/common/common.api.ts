import service from "../../partials/services/axios.config";

export type ResponseAPI = {
  message?: string;
  results?: any;
};

export type QueryFunc = (queryKey) => Promise<ResponseAPI>;

export const getCampaigns: QueryFunc = async ({ queryKey }) => {
  const { params } = queryKey[1];
  return await service.get("/campaign", { params });
};

export const getStoreAppById: QueryFunc = async ({ queryKey }) => {
  const appId = queryKey[1];

  if (!appId) {
    return Promise.resolve({});
  }
  return await service.get(`/prototype-campaigns/${appId}`);
};

export const getCpiCampaignById: QueryFunc = async ({ queryKey }) => {
  const appId = queryKey[1];

  if (!appId) {
    return Promise.resolve({});
  }
  return await service.get(`/cpi-campaigns/${appId}`);
};

export const getCurrency: QueryFunc = async () => {
  return await service.get("/rule-config/currency");
};
