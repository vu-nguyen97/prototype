import React from "react";
import PropTypes from "prop-types";
import NewVariant from "./NewVariant";
import AddCampaigns from "../../AddCampaign";

function VariantDetail(props) {
  const { data, idx, init } = props;

  return (
    <div className="p-4 sm:p-6">
      {!init ? (
        <>
          <div>
            <AddCampaigns data={data}></AddCampaigns>
          </div>
        </>
      ) : (
        <NewVariant />
      )}
    </div>
  );
}

VariantDetail.propTypes = {
  data: PropTypes.object,
  idx: PropTypes.number,
  init: PropTypes.bool,
};

export default VariantDetail;
