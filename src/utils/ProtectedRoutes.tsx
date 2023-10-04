import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { APP_PATH, ORGANIZATION_PATH } from "../constants/constants";
import { RootState } from "../redux/store";

// Restrict import to this file
export const CampaignCenterTabs = {
  report: "report",
  bidHistory: "bid-history",
  budgetHistory: "budget-history",
  batchHistory: "batch-history",
};

export const ProtectedRoutes = () => {
  const token = useSelector((state: RootState) => state.account.token);
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export const AdminRoutes = () => {
  const isAdmin = useSelector(
    (state: RootState) => state.account.userData.isAdmin
  );
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

const URL_BY_CODE = {
  batchHistory: {
    code: "1011",
    url: "/campaign-management",
    tab: CampaignCenterTabs.batchHistory,
  },
  settings: { code: "1012", url: "/settings", tab: "" },
  campaignManagement: {
    code: "1013",
    url: "/campaign-management",
    tab: "report",
  },
  fileHistory: { code: "1014", url: "/bid-csv", tab: "history" },
  campaignControl: { code: "1015", url: "/campaign-control", tab: "" },
};

export const ExternalUrlRoutes = () => {
  const params = useParams();
  const { pageCode, appId } = params;

  let redirectedPage = <></>;
  if (!appId) {
    switch (pageCode) {
      case "1010":
        redirectedPage = (
          <Navigate to={"/connectors" + window.location.search} />
        );
        break;
      default:
        redirectedPage = <Navigate to="/" />;
    }
  } else {
    switch (pageCode) {
      case URL_BY_CODE.settings.code:
        redirectedPage = <Navigate to={APP_PATH + "/" + appId + "/settings"} />;
        break;
      // Todo: add remain case?
      default:
        redirectedPage = <Navigate to="/" />;
    }
  }

  return redirectedPage;
};

export const getExternalUrl = (str, orgCode, getApp = true) => {
  if (!str || typeof str !== "string") {
    return "/";
  }

  const listSlug = str.split("/");
  const orgUrl = ORGANIZATION_PATH + "/" + orgCode;

  let url = "/";
  if (getApp && listSlug.length >= 1) {
    const appId = listSlug[0];
    const activedPage = Object.values(URL_BY_CODE).find(
      (el) => el.code === listSlug[listSlug.length - 1]
    );

    if (activedPage) {
      const pageUrl = activedPage.url;
      url = orgUrl + APP_PATH + "/" + appId + pageUrl;

      if (activedPage?.code === URL_BY_CODE.campaignControl.code) {
        url += "/" + listSlug[1];
      }

      if (activedPage?.tab) {
        url = url + "?tab=" + activedPage.tab;
      }
    }
  }

  return url;
};
