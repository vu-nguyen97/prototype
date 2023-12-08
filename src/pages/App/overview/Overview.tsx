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
    const [criteria, setCriteria] = useState("0");
    let {appId} = useParams();
    useEffect(() => {
        setIsLoading(true);
        service.get("/report?CPICampaignId="+appId).then(
            (res: any) => {
                setListReport(res.results);
                console.log(res.results)
                setIsLoading(false);
            },
            () => setIsLoading(false)
        );
    }, []);

  return (
    <Page>
      {isLoading ? <Loading/>:
      <div className="bg-white p-4 rounded-sm shadow mt-2" id="OverviewPage">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-6">
            <div>
            <div className="w-100 border-black border-2 ml-5 mr-5 mt-1 mb-1 text-center">
                  <h1  className="text-xl mt-3">IMPRESSION</h1>
                  <Container listReport = {listReport} listChart = {[{ key: "1", label: "PieChart" },
                      { key: "2", label: "DoughnutChart"},
                      { key: "3", label: "BarChart"}]} criteria="0"/>
              </div>
            </div>
            <div>
            <div className="w-100 border-black border-2 ml-5 mr-5 mt-1 mb-1 text-center">
                  <h1  className="text-xl mt-3">CLICK</h1>
                  <Container listReport = {listReport} listChart = {[{ key: "1", label: "PieChart" },
                      { key: "2", label: "DoughnutChart"},
                      { key: "3", label: "BarChart"}]} criteria="1"/>
              </div>
            </div>
            <div>
            <div className="w-100 border-black border-2 ml-5 mr-5 mt-1 mb-1 text-center">
                  <h1  className="text-xl mt-3">INSTALL</h1>
                  <Container listReport = {listReport} listChart = {[{ key: "1", label: "PieChart" },
                      { key: "2", label: "DoughnutChart"},
                      { key: "3", label: "BarChart"}]} criteria="2"/>
              </div>
            </div>
            <div>
            <div  className="w-100 border-black border-2 ml-5 mr-5 mt-1 mb-1 text-center">
                  <h1  className="text-xl mt-3">COST</h1>
                  <Container listReport = {listReport} listChart = {[{ key: "1", label: "PieChart" },
                      { key: "2", label: "DoughnutChart"},
                      { key: "3", label: "BarChart"}]} criteria="3"/>
              </div>
            </div>
          </div>
      </div>}
    </Page>
  );
}

export default Overview;
