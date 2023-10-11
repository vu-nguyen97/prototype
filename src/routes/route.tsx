import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  AdminRoutes,
  ExternalUrlRoutes,
  ProtectedRoutes,
} from "../utils/ProtectedRoutes";
import { FallbackProvider } from "../utils/composables/FallbackProvider";
// import ErrorBoundary from "../utils/ErrorBoundary";

const DefaultLayout = React.lazy(() => import("../partials/layouts/layout"));

const getPage = (comp, padding = true) => (
  <Suspense fallback={<DefaultLayout />}>
    <DefaultLayout padding={padding}>{comp}</DefaultLayout>
  </Suspense>
);
const getAppPage = (comp, padding = true) => (
  <Suspense fallback={<DefaultLayout isDetailApp />}>
    <DefaultLayout isDetailApp padding={padding}>
      {comp}
    </DefaultLayout>
  </Suspense>
);

// https://loadable-components.com/docs/loadable-vs-react-lazy/
// https://github.com/vitejs/vite/issues/1931
// const AsyncPage = loadable(
//   (props) =>
//     import(
//       /* @vite-ignore */ `../pages/${props.page}/${props.page}.{tsx,jsx,ts,js}`
//     )
// );
const Login = React.lazy(() => import("../pages/Login"));
const SignUp = React.lazy(() => import("../pages/SignUp"));
const EnterOtp = React.lazy(() => import("../pages/OTP/EnterOtp"));
const ForgotPassword = React.lazy(() => import("../pages/ForgotPassword"));
const Page404 = React.lazy(() => import("../pages/Page404"));
const CreatePassword = React.lazy(() => import("../pages/CreatePassword"));
const Dashboard = React.lazy(() => import("../pages/Dashboard/Dashboard"));
const Configs = React.lazy(() => import("../pages/Configs/Configs"));
const Members = React.lazy(() => import("../pages/Members/Members"));
const Account = React.lazy(() => import("../pages/Settings/Account"));
const PrototypeCamp = React.lazy(
  () => import("../pages/PrototypeCampaigns/PrototypeCampaigns")
);
const DataConnectors = React.lazy(
  () => import("../pages/DataConnectors/DataConnectors")
);
const Apps = React.lazy(() => import("../pages/Apps/Apps"));
const NetworkConfig = React.lazy(
  () => import("../pages/NetworkConfig/NetworkConfig")
);
const Campaigns = React.lazy(() => import("../pages/App/Campaigns/Campaigns"));
const CampaignDetail = React.lazy(
  () => import("../pages/App/Campaigns/CampaignDetail/CampaignDetail")
);
const Themes = React.lazy(() => import("../pages/App/Themes/Themes"));
const Settings = React.lazy(() => import("../pages/App/setting/Settings"));
const Overview = React.lazy(() => import("../pages/App/overview/Overview"));
const Notifications = React.lazy(
  () => import("../pages/Settings/Notifications/Notifications")
);


const StoreAppDetail = React.lazy(
  () => import("../pages/Apps/AppDetail")
);

/**
 * Refs:
 * https://stackoverflow.com/questions/62384395/protected-route-with-react-router-v6
 * https://viblo.asia/p/react-router-dom-v6-maGK7BQB5j2#_1-cai-dat-0
 */
const AppRoutes = () => (
  <FallbackProvider>
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="apps" element={getPage(<Apps />)} />
        <Route
          path="prototype-campaigns"
          element={getPage(<PrototypeCamp />)}
        />
        {/* 
          appId thực tế trong project này là prototype campaign, 
          params hay dùng khi truyền cho be là "campaignId"! 
        */}
        <Route path="apps/:appId/">
          <Route index element={getAppPage(<Overview />)} />
          <Route path="overview" element={getAppPage(<Overview />)} />
          <Route path="campaigns" element={getAppPage(<Campaigns />)} />
          <Route
            path="campaigns/:campId"
            element={getAppPage(<CampaignDetail />, false)}
          />
          <Route path="themes" element={getAppPage(<Themes />)} />
          <Route path="settings" element={getAppPage(<Settings />)} />
        </Route>

        <Route path="configs" element={getPage(<Configs />)} />
        <Route path="connectors" element={getPage(<DataConnectors />)} />
        <Route path="settings/account" element={getPage(<Account />)} />
        <Route
          path="settings/notifications"
          element={getPage(<Notifications />)}
        />

        <Route path="store-app/:id">
          <Route index element={getPage(<StoreAppDetail />)} />
        </Route>

        <Route element={<AdminRoutes />}>
          <Route path="networks" element={getPage(<NetworkConfig />)} />
          <Route path="members" element={getPage(<Members />)} />
        </Route>

        <Route
          path="/external-url/:pageCode"
          element={getPage(<ExternalUrlRoutes />)}
        />
        <Route
          path="/external-url/:appId/:pageCode"
          element={getPage(<ExternalUrlRoutes />)}
        />
        <Route path="" element={getPage(<Dashboard />)} />
        <Route path="error-404" element={getPage(<Page404 />)} />
        <Route path="*" element={getPage(<Page404 />)} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/otp" element={<EnterOtp />} />
      <Route path="/create_password" element={<CreatePassword />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
    </Routes>
  </FallbackProvider>
);

export default AppRoutes;
