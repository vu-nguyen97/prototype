import React, { useEffect } from "react";

const UnityAdsDetail = ({ data }) => {
  const {
    id,
    packageId,
    unityAppId,
    unityCampaignId,
    campaignName,
    goal,
    billingType,
    biddingStrategy,
    attributionClickUrl,
    attributionStartUrl,
    attributionViewUrl,
    countryBids,
    dailyBudget,
    totalBudget,
    scheduleStart,
    scheduleEnd,
  } = data;
  
  const formattedScheduleStart = new Date(scheduleStart).toLocaleString();
  const formattedScheduleEnd = new Date(scheduleEnd).toLocaleString();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Unity Ads Details:</h2>

      <br />
      <br />

      <div className="mb-4">
        <p className="font-bold">Package ID:</p>
        <p>{packageId}</p>
      </div>

      <div className="mb-4">
        <p className="font-bold">Campaign Name:</p>
        <p>{campaignName}</p>
      </div>

      <div className="mb-4">
        <p className="font-bold">Goal:</p>
        <p>{goal}</p>
      </div>

      <div className="mb-4">
        <p className="font-bold">Billing Type:</p>
        <p>{billingType}</p>
      </div>

      <div className="mb-4">
        <p className="font-bold">Bidding Strategy:</p>
        <p>{biddingStrategy}</p>
      </div>

      <div className="mb-4">
        <p className="font-bold">Attribution Click URL:</p>
        <p>{attributionClickUrl}</p>
      </div>

      <div className="mb-4">
        <p className="font-bold">Attribution Start URL:</p>
        <p>{attributionStartUrl}</p>
      </div>

      <div className="mb-4">
        <p className="font-bold">Attribution View URL:</p>
        <p>{attributionViewUrl}</p>
      </div>

      <div className="mb-4">
        <p className="font-bold">Country Bids:</p>
        <ul>
          {countryBids.map((countryBid, index) => (
            <li key={index}>
              {countryBid.country} - {countryBid.bid}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <p className="font-bold">Daily Budget:</p>
        <p>{dailyBudget}</p>
      </div>

      <div className="mb-4">
        <p className="font-bold">Total Budget:</p>
        <p>{totalBudget}</p>
      </div>

      <div className="mb-4">
        <p className="font-bold">Schedule:</p>
        <p>{formattedScheduleStart} - {formattedScheduleEnd}</p>
      </div>
    </div>
  );
};

export default UnityAdsDetail;
