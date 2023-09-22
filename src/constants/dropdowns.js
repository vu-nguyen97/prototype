export const LIST_DIMENSION = {
  adNetwork: "0",
  country: "1",
  campaign: "2",
  adGroup: "3",
  keyword: "4",
  campaignType: "5",
  siteId: "6",
  adGroupStatus: "7",
  ltvDate: "8",
};

export const RUNNING = "RUNNING";
export const PAUSED = "PAUSED";
export const ADGROUP_STATUS = [RUNNING, PAUSED];

export const DIMENSION_OPTIONS = [
  { value: LIST_DIMENSION.adNetwork, name: "Ad Network" },
  { value: LIST_DIMENSION.campaign, name: "Campaign" },
  { value: LIST_DIMENSION.adGroup, name: "Ad Group" },
  { value: LIST_DIMENSION.adGroupStatus, name: "Ad Group Status" },
  { value: LIST_DIMENSION.keyword, name: "Keyword" },
  { value: LIST_DIMENSION.country, name: "Country" },
  { value: LIST_DIMENSION.campaignType, name: "Campaign Type" },
  { value: LIST_DIMENSION.siteId, name: "Site Id" },
  { value: LIST_DIMENSION.ltvDate, name: "ARPDAU's time range" },
];
