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

// Hiện chưa có chỗ dùng (chỉ page Settings (app) gọi nhưng đã bỏ route này)
export const getStoreAppById: QueryFunc = async ({ queryKey }) => {
  const appId = queryKey[1];

  if (!appId) {
    return Promise.resolve({});
  }
  return await service.get(`/prototype-campaigns/${appId}`);
};

// Hiện chưa có chỗ dùng
export const getCpiCampaignById: QueryFunc = async ({ queryKey }) => {
  const appId = queryKey[1];

  if (!appId) {
    return Promise.resolve({});
  }
  return await service.get(`/cpi-campaigns/${appId}`);
};

// Gọi ở Sidebar của Store listing
export const getAppById: QueryFunc = async ({ queryKey }) => {
  const packageId = queryKey[1];

  if (!packageId) {
    return Promise.resolve({});
  }
  return await service.get(`/store-app/${packageId}`);
};

export const getCurrency: QueryFunc = async () => {
  return await service.get("/rule-config/currency");
};

export const getListStore: QueryFunc = async () => {
  return await service.get("/google-play-stores");
};
