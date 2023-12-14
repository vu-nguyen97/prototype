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
        setListReport(res.results);
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

  return (
    <Page>
      <div className="page-title">Overview</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-x-10 mt-2">
        {listCharts.map((el) => (
          <div className="bg-white rounded-md border shadow-lg" key={el.id}>
            <h1 className="font-semibold text-center text-base mt-4">
              {el.label}
            </h1>
            <div className="h-[350px] xs:h-[460px] p-3 xs:p-5 pt-3">
              <LineChart
                isLoading={isLoading}
                data={listReport}
                field={el.field}
              />
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

export default Overview;
