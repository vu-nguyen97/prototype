import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Page from "../../../../utils/composables/Page";
import service from "../../../../partials/services/axios.config";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "antd/lib/breadcrumb/Breadcrumb";
import Loading from "../../../../utils/Loading";
import { APP_PATH } from "../../../../constants/constants";

function CampaignDetail(props) {
  const urlParams = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState({ name: "AAAA" });

  useEffect(() => {
    setIsLoading(true);
    service
      .get("/bids/countries", { params: { campaignId: urlParams.appId } })
      .then(
        (res: any) => {
          console.log("res :>> ", res);
          setIsLoading(false);
        },
        () => setIsLoading(false)
      );
  }, []);

  return (
    <Page>
      {isLoading && <Loading />}

      <div className="page-breadcrum">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={APP_PATH + "/" + urlParams.appId + "/campaigns"}>
              Campaigns
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{campaignData.name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="px-4 sm:px-6 lg:px-12 2xl:px-24 py-6">BB</div>
    </Page>
  );
}

CampaignDetail.propTypes = {};

export default CampaignDetail;
