import PropTypes from "prop-types";
import React from "react";
import Page from "../../../utils/composables/Page";

function Overview(props) {
  const { isAllApp, isSkanPage } = props;

  return (
    <Page>
      <div className="mb-4" id="OverviewPage">
        Overview
      </div>
    </Page>
  );
}

Overview.propTypes = {
  isAllApp: PropTypes.bool,
  isSkanPage: PropTypes.bool,
};

export default Overview;
