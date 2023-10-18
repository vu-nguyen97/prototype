import React from "react";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import Tooltip from "antd/lib/tooltip";

export const formClass = "max-w-3xl";
export const bulkLink =
  "mt-1 text-antPrimary hover:text-antPrimary/80 cursor-pointer inline-block";

export const defaultGroups = [{ id: 0 }];
export const defaultGroupIds = [defaultGroups[0].id];

export const LONG_TIME = "longTime";
export const TIME_DISTANCE = "timeDistance";
export const DeliveryOpts = [
  { label: "Configure start and end time", value: TIME_DISTANCE },
  // {
  //   label: (
  //     <Tooltip
  //       title="If you prefer to manually stop the offer, please select long-term delivery."
  //       color="white"
  //       overlayClassName="tooltip-light"
  //       overlayInnerStyle={{ minWidth: 270 }}
  //     >
  //       Long-term <ExclamationCircleOutlined className="text-xs" />
  //     </Tooltip>
  //   ),
  //   value: LONG_TIME,
  // },
];

export const DAILY_CB = "dailyBudgetOpen";
export const TOTAL_CB = "totalBudgetOpen";
export const DAILY_BUDGET = "dailyBudget";
export const TOTAL_BUDGET = "totalBudget";

export const DYNAMIC_BUDGET_TYPE = "dynamicBudgetType";

export const DYNAMIC_DAILY_BUDGET_OPEN = "dynamicDailyBudgetOpen";
export const DYNAMIC_TOTAL_BUDGET_OPEN = "dynamicTotalBudgetOpen";
export const DYNAMIC_DAILY_BUDGET = "dynamicDailyBudget";
export const DYNAMIC_TOTAL_BUDGET = "dynamicTotalBudget";

export const AUTOMATED = "automated";

export const UnitySteps = [
  { title: "Input Basic Info" },
  { title: "Set Bid Rate & Budget" },
  { title: "Upload Creatives" },
];

export const BIDDING_STRATEGIES = ["automated", "manual"];
export const BIDDING_TYPES = ["cpi", "cpm"];
export const TYPES = ["CPI", "RETENTION", "ROAS"];
