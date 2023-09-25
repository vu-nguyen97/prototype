import service from "../../partials/services/axios.config";
import { QueryFunc } from "../common/common.api";

export const getStoreApps: QueryFunc = async () => {
  return await service.get("/apps");
};
