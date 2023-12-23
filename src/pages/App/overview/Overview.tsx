import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import LineChart from "./Charts/LineChart";
import service from "../../../partials/services/axios.config";
import { useParams } from "react-router-dom";

const SupportedCharts = [
  { key: "1", label: "PieChart" },
  { key: "2", label: "DoughnutChart" },
  { key: "3", label: "BarChart" },
];

function Overview(props) {
  const { appId } = useParams();
  const [listReport, setListReport] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    service.get("/report?CPICampaignId=" + appId).then(
      (res: any) => {
        // Calculate CPI, CPM, CVR, and IPM for each item in the results array
        const updatedResults = res.results.map((item: any) => {
          const install = item.install || 0;
          const click = item.click || 0;
          const cost = item.cost || 0;
          const impressions = item.impression || 0;
  
          const cpi = install > 0 ? (cost / install).toFixed(2) : 0;
          const cpm = impressions > 0 ? (cost / (impressions / 1000)).toFixed(2) : 0;
          const cvr = click > 0 ? (install / click).toFixed(2) : 0;
          const ipm = impressions > 0 ? (install / (impressions / 1000)).toFixed(2) : 0;
  
          // Add calculated values to the current item in the array
          return {
            ...item,
            cpi,
            cpm,
            cvr,
            ipm,
          };
        });
  
        // Now, updatedResults is an array where each object contains the original properties plus cpi, cpm, cvr, and ipm
        setListReport(updatedResults);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  }, []);
  
  
  

  const listCharts = [
    { id: 0, label: "IMPRESSION", field: "impression" },
    { id: 1, label: "CLICK", field: "click" },
    { id: 2, label: "INSTALL", field: "install" },
    { id: 3, label: "COST", field: "cost" },
  ];

  const cpiCharts =[
    { id: 4, label: "CPI", field: "cpi" },
    { id: 5, label: "IPM", field: "ipm" },
    { id: 6, label: "CPM", field: "cpm" },
    { id: 7, label: "CVR", field: "cvr" }
    
  ];

  return (
    // grid grid-cols-12 gap-6 mt-6
    <Page>
      <div className="page-title">Overview</div>
      <div className="relative pb-[3.25rem]">
        <div className="grid grid-cols-12 gap-6 mt-6">
          {listCharts.map((el) => (
            <div className="relative flex flex-col col-span-full sm:col-span-6 md:col-span-4 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200" key={el.id}>
              <h1 className="font-semibold text-center text-base mt-4">
                {el.label}
              </h1>
              <div className="h-[150px] xs:h-[200px] p-3 xs:p-5 pt-3">
                <LineChart
                  isLoading={isLoading}
                  data={listReport}
                  field={el.field}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative pb-[3.25rem]">
        <div className="grid grid-cols-6 gap-3 mt-6">
          {cpiCharts.map((el) => (
            <div className="relative flex flex-col col-span-full sm:col-span-6 md:col-span-4 xl:col-span-3 bg-white shadow-lg rounded-sm border border-slate-200" key={el.id}>
              <h1 className="font-semibold text-center text-base mt-4">
                {el.label}
              </h1>
              <div className="h-[150px] xs:h-[200px] p-3 xs:p-5 pt-3">
                <LineChart
                  isLoading={isLoading}
                  data={listReport}
                  field={el.field}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

export default Overview;
