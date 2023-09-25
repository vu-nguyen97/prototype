import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import service from "../../../partials/services/axios.config";
import { useParams } from "react-router-dom";
import CampaignTable from "./Table/CampaignTable";
import Select from "antd/lib/select";
import Button from "antd/lib/button/button";

function Campaigns(props) {
  const urlParams = useParams();
  const [campaigns, setCampaigns] = useState([]);
  const [activedTheme, setActivedTheme] = useState();

  useEffect(() => {
    console.log("activedTheme :>> ", activedTheme);
  }, [activedTheme]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const params = { appIds: urlParams.appId };
    service.get("/campaigns", { params }).then((res: any) => {
      setCampaigns(res.results);
    });
  };

  return (
    <Page>
      <div className="flex justify-between">
        <div className="page-title">Campaigns</div>
      </div>

      <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2">
        <Select
          allowClear
          placeholder="Select theme"
          className="xs:!w-[350px] !mx-1 2xl:!mx-2 !mt-3"
          value={activedTheme}
          onChange={setActivedTheme}
        >
          {["aaa", "bbb"].map((data: any, idx) => {
            return (
              <Select.Option value={data} key={idx}>
                <div>{data}</div>
              </Select.Option>
            );
          })}
        </Select>

        <Button
          type="primary"
          // onClick={getData}
          className="mx-1 2xl:!mx-2 mt-3"
        >
          Apply
        </Button>
      </div>

      <CampaignTable data={campaigns} />
    </Page>
  );
}

export default Campaigns;
