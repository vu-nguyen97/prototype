import React from "react";
import { AiOutlineDashboard } from "@react-icons/all-files/ai/AiOutlineDashboard";
import { AiOutlineAppstore } from "@react-icons/all-files/ai/AiOutlineAppstore";
import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { AiOutlineUsergroupAdd } from "@react-icons/all-files/ai/AiOutlineUsergroupAdd";
import { AiOutlineTool } from "@react-icons/all-files/ai/AiOutlineTool";
import { AiOutlineNotification } from "@react-icons/all-files/ai/AiOutlineNotification";
import { AiOutlineForm } from "@react-icons/all-files/ai/AiOutlineForm";
import { FaGooglePlay } from "@react-icons/all-files/fa/FaGooglePlay";
import { FaDocker } from "@react-icons/all-files/fa/FaDocker";
import { AiOutlineNodeIndex } from "@react-icons/all-files/ai/AiOutlineNodeIndex";
import { BiPalette } from "@react-icons/all-files/bi/BiPalette";


export const SidebarConfigs = [
  {
    id: 0,
    url: "/",
    label: "Dashboard",
    iconEl: <AiOutlineDashboard size={20} />,
    preload: () => import("../../pages/Dashboard/Dashboard"),
  },
  {
    id: 1,
    url: "/apps",
    label: "Apps",
    iconEl: <AiOutlineAppstore size={20} />,
    preload: () => import("../../pages/Apps/Apps"),
  },
  {
    id: 2,
    url: "/cpi-campaigns",
    label: "CPI Campaigns",
    iconEl: <FaGooglePlay size={16} />,
    preload: () => import("../../pages/PrototypeCampaigns/CPICampaigns"),
  },
  {
    id: 3,
    url: "/configs",
    label: "Configs",
    iconEl: <AiOutlineForm size={20} />,
    preload: () => import("../../pages/Configs/Configs"),
  },
  {
    id: 4,
    url: "/connectors",
    label: "Data Connectors",
    iconEl: <AiOutlineNodeIndex size={20} />,
    preload: () => import("../../pages/DataConnectors/DataConnectors"),
  },
  {
    id: 5,
    url: "/release",
    label: "Create new release",
    iconEl: <FaGooglePlay size={16} />,
    preload: () => import("../../pages/CreateNewRelease/CreateNewRelease"),
  },
  {
    id: 6,
    url: "/google-play-account",
    label: "Google Play Console",
    iconEl: <FaGooglePlay size={16} />,
    preload: () => import("../../pages/GoogleAccount/GoogleAccount"),
  },
  {
    id: 7,
    url: "/chrome-standalone",
    label: "Chrome Standalone",
    iconEl: <FaDocker size={16} />,
    preload: () => import("../../pages/ChromeStandalone/ChromeStandalone"),
  },
  {
    id: 8,
    url: "/members",
    label: "Members",
    checkAdmin: true,
    iconEl: <AiOutlineUsergroupAdd size={20} />,
    preload: () => import("../../pages/Members/Members"),
  },
  {
    id: 9,
    url: "/settings",
    label: "Settings",
    iconEl: <AiOutlineTool size={20} />,
    children: [
      {
        url: "/settings/account",
        label: "Account",
        preload: () => import("../../pages/Settings/Account"),
      },
      {
        url: "/settings/notifications",
        label: "Notifications",
        preload: () =>
          import("../../pages/Settings/Notifications/Notifications"),
      },
    ],
  },
];

export const SidebarAppConfigs = [
  {
    id: 0,
    url: "/overview",
    label: "Overview",
    iconEl: <AiOutlineDashboard size={20} />,
    preload: () => import("../../pages/App/overview/Overview"),
  },
  {
    id: 1,
    url: "/themes",
    label: "Comparing Themes",
    iconEl: <BiPalette size={20} />,
    preload: () => import("../../pages/App/Variants/AppVariants"),
  },
  // {
  //   id: 2,
  //   url: "/campaigns",
  //   label: "Unity campaigns",
  //   iconEl: <AiOutlineNotification size={20} />,
  //   preload: () => import("../../pages/App/Campaigns/Campaigns"),
  // },
  {
    id: 6,
    url: "/settings",
    label: "Settings",
    iconEl: <AiOutlineSetting size={20} />,
    preload: () => import("../../pages/App/setting/Settings"),
  },
];

export const SidebarStoreAppConfigs = [
  {
    id: 0,
    url: "/main-store-listing",
    label: "Main Store Listing",
    iconEl: <AiOutlineDashboard size={20} />,
    preload: () => import("../../pages/Apps/AppDetails/MainStoreListing"),
  },
  {
    id: 1,
    url: "/custom-store-listing",
    label: "Custom Store Listing",
    iconEl: <BiPalette size={20} />,
    preload: () => import("../../pages/Apps/AppDetails/CustomStoreListing"),
  },
];
