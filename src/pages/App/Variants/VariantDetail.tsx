import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import NewListing from "./NewVariant";
import AddCampaigns from "../../AddCampaign";
import { Collapse } from "antd";
import UnityAdsDetail from "./UnityAdsDetail";
const { Panel } = Collapse;

const onCollapseChange = () => {};

function VariantDetail(props) {
  const {
    data,
    idx,
    init,
    unityAdsSettings,
    setUnityAdsSettings,
    pickedVariant,
    consoleAppId,
  } = props;

  console.log("data", data);

  console.log("unity Ads");
  console.log(unityAdsSettings);
  var unityPanelHeader = "Unity ads";

  const [initing, setIniting] = useState(init);
  const [unityAds, setUnityAds] = useState(data?.unityAds);
  // if(data && data.unityAds){

  // } else {
  //   unityPanelHeader = unityPanelHeader + " - Not set"
  // }

  return (
    <div className="p-4 sm:p-6">
      {!init ? (
        <>
          <div>
            <Collapse defaultActiveKey={["1"]} onChange={onCollapseChange}>
              <Panel header="Custom listing" key="1">
                <NewListing viewOnlyMode={true} customListing={data.customListing} idx={idx} />
              </Panel>
              <Panel header={unityPanelHeader} key="2">
                {data && unityAds ? (
                  unityAds.unityCampaignId ? (
                    <UnityAdsDetail data={unityAds} />
                  ) : (
                    <UnityAdsDetail data={unityAds} finished={false} appVariantId={data.id} setUnityAds={setUnityAds} />
                  )
                ) : (
                  <AddCampaigns
                    data={data}
                    unityAdsSettings={unityAdsSettings}
                    setUnityAdsSettings={setUnityAdsSettings}
                    setUnityAds={setUnityAds}
                  ></AddCampaigns>
                )}
              </Panel>
            </Collapse>
          </div>
        </>
      ) : (
        <NewListing
          pickedVariant={pickedVariant}
          idx={idx}
          consoleAppId={consoleAppId}
        />
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
  consoleAppId: PropTypes.string,
};

export default VariantDetail;
