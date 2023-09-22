import React from "react";
import { AiOutlineDashboard } from "@react-icons/all-files/ai/AiOutlineDashboard";
import { AiOutlineAppstore } from "@react-icons/all-files/ai/AiOutlineAppstore";
import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { AiOutlineUsergroupAdd } from "@react-icons/all-files/ai/AiOutlineUsergroupAdd";
import { AiOutlineTool } from "@react-icons/all-files/ai/AiOutlineTool";

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
    id: 6,
    url: "/settings",
    label: "Settings",
    iconEl: <AiOutlineSetting size={20} />,
    preload: () => import("../../pages/App/setting/Settings"),
  },
];
