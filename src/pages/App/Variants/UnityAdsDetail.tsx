import React, { useEffect, useState } from "react";
import service from "../../../partials/services/axios.config";
import PropTypes from "prop-types";

const UnityAdsDetail = (props) => {
  const { data, finished, appVariantId, setUnityAds } = props;
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

  const [status, setStatus] = useState("");

  const fetchStatus = () => [
    service.get("/unity-ads-status/" + appVariantId).then((res) => {
      console.log("status response", res.results);
      setStatus(res.results);
      if (res.results === "Completed") {
        window.location.reload();
      }
    }),
  ];

  if (!finished) {
    useEffect(() => {
      // schedule call to fetch status
      const intervalId = setInterval(() => {
        fetchStatus();
      }, 2000);
    }, []);
  }

  const formattedScheduleStart = new Date(scheduleStart).toLocaleString();
  const formattedScheduleEnd = new Date(scheduleEnd).toLocaleString();

  return (
    <>
      {finished ? (
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
            <p>
              {formattedScheduleStart} - {formattedScheduleEnd}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Unity Ads Status: {status}</h2>
        </div>
      )}
    </>
  );
};

UnityAdsDetail.propTypes = {
  data: PropTypes.any,
  finished: PropTypes.bool,
  appVariantId: PropTypes.string,
  setUnityAds: PropTypes.func,
};

UnityAdsDetail.defaultProps = {
  data: {},
  finished: true,
  appVariantId: "",
  setUnityAds: () => {},
};

export default UnityAdsDetail;
