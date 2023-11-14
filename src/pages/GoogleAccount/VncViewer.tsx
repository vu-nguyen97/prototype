import React, { useState, useEffect } from "react";
import Page from "../../utils/composables/Page";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
const VncViewer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const state = Object.fromEntries(queryParams.entries());
  const ip = state.ip;
  const vncPort = state.vncPort;
  const vncPassword = state.vncPassword;
  console.log(ip,vncPort,vncPassword);

  useEffect(() => {
    window.history.pushState({}, "", "/");
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      service.post("/restart-task").then(
        (res: any) => {
        toast(res.message || "restart task success!", { type: "success" });
      },
    );
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  

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
