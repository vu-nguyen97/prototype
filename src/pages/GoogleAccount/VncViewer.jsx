import React, { useState } from "react";
import Page from "../../utils/composables/Page";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
const VncViewer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  // const { ip, vncPort, vncPassword } = location.state;
  const ip = location.state.ip;
  const vncPort = location.state.vncPort;
  const vncPassword = location.state.vncPassword;
  const vncViewUrl =
    `http://` +
    ip +
    ":" +
    vncPort +
    "/?scaling=local&autoconnect=1&password=" +
    vncPassword;
  return (
    <Page>
      <div>
        <iframe
          id="vncFrame"
          src={vncViewUrl}
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
