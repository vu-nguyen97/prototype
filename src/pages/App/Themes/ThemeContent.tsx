import React from "react";
import PropTypes from "prop-types";
import NewTheme from "./NewTheme/NewTheme";
import AddCampaigns from "../../AddCampaign";

function ThemeContent(props) {
  const { data, idx, init } = props;

  return (
    <div className="p-4 sm:p-6">
      {!init ? (
        <>
          <div>
            <AddCampaigns name={data.name}></AddCampaigns>
          </div>
        </>
      ) : (
        <NewTheme />
      )}
    </div>
  );
}

ThemeContent.propTypes = {
  data: PropTypes.object,
  idx: PropTypes.number,
  init: PropTypes.bool,
};

export default ThemeContent;
