import React, { useState } from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import Unity from "./Unity/Unity";
import PropTypes from "prop-types";

function AddCampaigns(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [stepData, setStepData] = useState({});
  const [appVariantId, setAppVariantId] = useState(props.data.id);
  const unityAdsSettings = props.unityAdsSettings;

  const networkProps = {
    stepData,
    setIsLoading,
    setStepData,
    appVariantId,
    unityAdsSettings,
  };

  return (
    <Page>
      {isLoading && <Loading />}

      {/* <div className="px-4 sm:px-6 lg:px-12 2xl:px-24"> */}
        {/* <div className="page-title">Create Unity campaign for {props.data.name}</div> */}

        <div className="rounded px-6 py-5 text-base mt-4 min-h-[200px] bg-white">
          <Unity {...networkProps} />
        </div>
      {/* </div> */}
    </Page>
  );
}

AddCampaigns.propTypes = {
  data: PropTypes.object,
  unityAdsSettings: PropTypes.object,
  setUnityAdsSettings: PropTypes.func,
};

export default AddCampaigns;
