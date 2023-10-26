import React, { useState } from "react";
import Page from "../../utils/composables/Page";
import PropTypes from "prop-types";

const VncViewer = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { vncIp, vncPort, vncPass } = props;
  const vncViewUrl =
    `http://` +
    vncIp +
    ":" +
    vncPass +
    "/?scaling=local&autoconnect=1&password=" +
    vncPass;
  return (
    <Page>
      <div>
        <iframe
          id="vncFrame"
          src={vncViewUrl}
          frameBorder="0"
          style={{ width: "100%", height: "900px" }}
        ></iframe>
      </div>
    </Page>
  );
};

VncViewer.propTypes = {
  vncIp: PropTypes.string,
  vncPort: PropTypes.string,
  vncPass: PropTypes.string,
};

export default VncViewer;
