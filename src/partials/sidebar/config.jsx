import React from "react";
import { AiOutlineDashboard } from "@react-icons/all-files/ai/AiOutlineDashboard";
import { AiOutlineAppstore } from "@react-icons/all-files/ai/AiOutlineAppstore";
import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { AiOutlineUsergroupAdd } from "@react-icons/all-files/ai/AiOutlineUsergroupAdd";
import { AiOutlineTool } from "@react-icons/all-files/ai/AiOutlineTool";
import { AiOutlineForm } from "@react-icons/all-files/ai/AiOutlineForm";
import { FaGooglePlay } from "@react-icons/all-files/fa/FaGooglePlay";
import { FaDocker } from "@react-icons/all-files/fa/FaDocker";
import { AiOutlineNodeIndex } from "@react-icons/all-files/ai/AiOutlineNodeIndex";
import { BiPalette } from "@react-icons/all-files/bi/BiPalette";
import { AiOutlineEdit } from "react-icons/ai";
import { MdNewReleases } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { MdOutlineCyclone } from "react-icons/md";
import { DEFAULT_SIDEBAR_TAB } from "../../constants/constants";

export const SidebarConfigs = [
  // {
  //   id: DEFAULT_SIDEBAR_TAB, // DEFAULT_SIDEBAR_TAB = 0
  //   url: "/",
  //   label: "Dashboard",
  //   iconEl: <AiOutlineDashboard size={20} />,
  //   preload: () => import("../../pages/Dashboard/Dashboard"),
  // },
  {
    id: 5,
    url: "/release",
    label: "Releases",
    iconEl: <MdNewReleases size={20} />,
    preload: () => import("../../pages/Releases/Releases"),
  },
  {
    id: 1,
    url: "/apps",
    label: "Apps",
    iconEl: <AiOutlineAppstore size={20} />,
    preload: () => import("../../pages/Apps/Apps"),
  },
  {
    id: DEFAULT_SIDEBAR_TAB,
    url: "/cpi-campaigns",
    label: "CPI Campaigns",
    iconEl: <FaGooglePlay size={16} />,
    preload: () => import("../../pages/PrototypeCampaigns/CPICampaigns"),
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
        url: "/settings/notifications",
        label: "Notifications",
        preload: () =>
          import("../../pages/Settings/Notifications/Notifications"),
      },
      {
        url: "/settings/connectors",
        label: "Data Connectors",
        iconEl: <AiOutlineNodeIndex size={20} />,
        preload: () => import("../../pages/DataConnectors/DataConnectors"),
      },
      {
        url: "/settings/selenium-clients",
        label: "Automated Clients",
        iconEl: <FaDocker size={16} />,
        preload: () => import("../../pages/SeleniumClients/SeleniumClients"),
      },
      {
        url: "/settings/google-play-account",
        label: "Developer Accounts",
        iconEl: <FaGooglePlay size={16} />,
        preload: () => import("../../pages/GoogleAccount/GoogleAccount"),
      },
      {
        url: "/settings/task-management",
        label: "Task Mangement",
        iconEl: <AiOutlineForm size={20} />,
        preload: () => import("../../pages/TaskManagement/TaskMangement"),
      },
      {
        url: "/settings/default-ads-config",
        label: "Ads Config",
        iconEl: <AiOutlineForm size={20} />,
        preload: () => import("../../pages/Configs/Configs"),
      },
    ],
  },
];

export const SidebarAppConfigs = [
  {
    id: 0,
    url: "/perfomance",
    label: "Perfomance",
    iconEl: <AiOutlineDashboard size={20} />,
    preload: () => import("../../pages/App/overview/Overview"),
  },
  {
    id: 1,
    url: "/themes",
    label: "Campaign Listing",
    iconEl: <BiPalette size={20} />,
    preload: () => import("../../pages/App/Variants/AppVariants"),
  },
  // {
  //   id: 6,
  //   url: "/settings",
  //   label: "Settings",
  //   iconEl: <AiOutlineSetting size={20} />,
  //   preload: () => import("../../pages/App/setting/Settings"),
  // },
];

export const SidebarStoreAppConfigs = [
  {
    id: 0,
    url: "/overview",
    label: "Overview",
    iconEl: <AiOutlineDashboard size={20} />,
    preload: () => import("../../pages/Apps/AppDetails/AppOverview"),
  },
  {
    id: 1,
    url: "/main-store-listing",
    label: "Main Store Listing",
    iconEl: <GoChecklist size={20} />,
    preload: () => import("../../pages/Apps/AppDetails/MainStoreListing"),
  },
  {
    id: 2,
    url: "/custom-store-listing",
    label: "Custom Store Listing",
    iconEl: <MdOutlineCyclone size={20} />,
    preload: () => import("../../pages/Apps/AppDetails/CustomStoreListing"),
  },
];
