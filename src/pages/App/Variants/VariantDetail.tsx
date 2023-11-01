import React, { useEffect } from "react";
import PropTypes from "prop-types";
import NewListing from "./NewVariant";
import AddCampaigns from "../../AddCampaign";
import { Collapse } from "antd";
import UnityAdsDetail from "./UnityAdsDetail";
const { Panel } = Collapse;

const onCollapseChange = () => {};

function VariantDetail(props) {
  const { data, idx, init, unityAdsSettings, setUnityAdsSettings, pickedVariant, consoleAppId } = props;

  console.log("data", data);
  
  console.log("unity Ads");
  console.log(unityAdsSettings);

  return (
    <div className="p-4 sm:p-6">
      {!init ? (
        <>
          <div>
            <Collapse defaultActiveKey={["1"]} onChange={onCollapseChange}>
              <Panel header="App used" key="1">
                <NewListing viewOnlyMode={true} data={data} idx={idx} />
              </Panel>
              <Panel header="Unity ads" key="2">
                {data && data.unityAds && data.unityAds.unityCampaignId ? (
                  <UnityAdsDetail data={data.unityAds} />
                ) : (
                  <AddCampaigns data={data} unityAdsSettings={unityAdsSettings} setUnityAdsSettings={setUnityAdsSettings}></AddCampaigns>
                )}
              </Panel>
            </Collapse>
          </div>
        </>
      ) : (
        <NewListing pickedVariant={pickedVariant} idx={idx} consoleAppId={consoleAppId}/>
      )}
    </div>
  );
}

VariantDetail.propTypes = {
  data: PropTypes.object,
  idx: PropTypes.number,
  init: PropTypes.bool,
  pickedVariant: PropTypes.arrayOf(PropTypes.any),
  unityAdsSettings: PropTypes.object,
  setUnityAdsSettings: PropTypes.func,
  consoleAppId: PropTypes.string
};

export default VariantDetail;
