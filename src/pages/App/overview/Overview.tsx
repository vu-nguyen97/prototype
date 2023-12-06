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
          <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
              <div style={{ width: "40%", borderColor: "black", borderWidth: 2, marginLeft: "5%",marginRight: "5%", marginTop: "1%", marginBottom: "1%",textAlign: 'center'}}>
                  <h1 style={{fontSize: "20px", marginTop: 10}}>IMPRESSION</h1>
                  <Container listReport = {listReport} listChart = {[{ key: "1", label: "PieChart" },
                      { key: "2", label: "DoughnutChart"},
                      { key: "3", label: "BarChart"}]} criteria="0"/>
              </div>
              <div style={{ width: "40%", borderColor: "black", borderWidth: 2, marginLeft: "5%",marginRight: "5%",marginTop: "1%", marginBottom: "1%",textAlign: 'center'}}>
                  <h1 style={{fontSize: "20px", marginTop: 10}}>CLICK</h1>
                  <Container listReport = {listReport} listChart = {[{ key: "1", label: "PieChart" },
                      { key: "2", label: "DoughnutChart"},
                      { key: "3", label: "BarChart"}]} criteria="1"/>
              </div>
              </div>
            <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
              <div style={{ width: "40%", borderColor: "black", borderWidth: 2, marginLeft: "5%",marginRight: "5%",marginTop: "1%", marginBottom: "1%",textAlign: 'center'}}>
                  <h1 style={{fontSize: "20px", marginTop: 10}}>INSTALL</h1>
                  <Container listReport = {listReport} listChart = {[{ key: "1", label: "PieChart" },
                      { key: "2", label: "DoughnutChart"},
                      { key: "3", label: "BarChart"}]} criteria="2"/>
              </div>
              <div style={{ width: "40%", borderColor: "black", borderWidth: 2, marginLeft: "5%",marginRight: "5%",marginTop: "1%", marginBottom: "1%",textAlign: 'center'}}>
                  <h1 style={{fontSize: "20px", marginTop: 10}}>COST</h1>
                  <Container listReport = {listReport} listChart = {[{ key: "1", label: "PieChart" },
                      { key: "2", label: "DoughnutChart"},
                      { key: "3", label: "BarChart"}]} criteria="3"/>
              </div>
          </div>
      </div>}
    </Page>
  );
}

export default Overview;
