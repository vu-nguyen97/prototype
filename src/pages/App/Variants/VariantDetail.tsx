import React, { useEffect } from "react";
import PropTypes from "prop-types";
import NewVariant from "./NewVariant";
import AddCampaigns from "../../AddCampaign";
import { Collapse } from "antd";
import UnityAdsDetail from "./UnityAdsDetail";
const { Panel } = Collapse;

const onCollapseChange = () => {};

function VariantDetail(props) {
  const { data, idx, init, unityAdsSettings, setUnityAdsSettings } = props;

  console.log("unity Ads");
  console.log(unityAdsSettings);

  return (
    <div className="p-4 sm:p-6">
      {!init ? (
        <>
          <div>
            <Collapse defaultActiveKey={["1"]} onChange={onCollapseChange}>
              <Panel header="App used" key="1">
                <NewVariant viewOnlyMode={true} data={data} />
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
        <NewVariant idx={idx} />
      )}
    </div>
  );
}

VariantDetail.propTypes = {
  data: PropTypes.object,
  idx: PropTypes.number,
  init: PropTypes.bool,
  unityAdsSettings: PropTypes.object,
  setUnityAdsSettings: PropTypes.func,
  
};

export default VariantDetail;
