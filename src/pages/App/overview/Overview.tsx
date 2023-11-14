import React, {useEffect, useState} from "react";
import Page from "../../../utils/composables/Page";
import LineChart from "./Charts/LineChart";
import BarChart from "./Charts/BarChart";
import PieChart from "./Charts/PieChart"
import DoughnutChart from "./Charts/DoughnutChart";
import StackBarChart from "./Charts/StackBarChart";
import service from "../../../partials/services/axios.config";
import Loading from "../../../utils/Loading";
import Dropdown from "antd/lib/dropdown";
import MoreOutlined from "@ant-design/icons/lib/icons/MoreOutlined";
import Container from "./Components/Container"
import { useParams } from "react-router-dom";
function Overview(props) {
    const [listReport, setListReport] = useState<any>([]);
    const [listAppVariant, setListAppVariant] = useState<any>([]);
    const [listAds, setListAds] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [criteria, setCriteria] = useState("1");
    let {appId} = useParams();
    useEffect(() => {
        setIsLoading(true);
        service.get("/report?CPICampaignId="+appId).then(
            (res: any) => {
                setListReport(res.results);
                setIsLoading(false);
            },
            () => setIsLoading(false)
        );
    }, []);

  return (
    <Page>
      {isLoading ? <Loading/>:
      <div className="mb-4" id="OverviewPage">
          <ul>
              <li style={{backgroundColor: "#EEEEEE"}}>
                  <h1 style={{fontSize: "20px", marginLeft: "5px"}}>Compare according to<Dropdown
                      className="!ml-0 xs:!ml-2"
                      menu={{
                          selectable: true,
                          // selectedKeys: [filter],
                          items: [
                              { key: "1", label: "impression" },
                              { key: "2", label: "click" },
                              { key: "3", label: "install"},
                              { key: "4", label: "cost"}
                          ],
                          onClick: (item) => setCriteria(item.key),
                      }}
                      trigger={["click"]}
                  >
                      <button className="custom-btn-light">
                          {criteria=="1"&&"impression"}
                          {criteria=="2"&&"click"}
                          {criteria=="3"&&"install"}
                          {criteria=="4"&&"cost"}
                      </button>
                  </Dropdown></h1>
                  <Container listReport = {listReport} listChart = {[{ key: "1", label: "PieChart" },
                      { key: "2", label: "DoughnutChart"},
                      { key: "3", label: "BarChart"}]} criteria={criteria}/>
              </li>
          </ul>
      </div>}
    </Page>
  );
}

export default Overview;
